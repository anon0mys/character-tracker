require 'set'

class CharacterService
  attr_reader :character, :params, :errors

  DND_SKILLS = %w[
    acrobatics animal_handling arcana athletics deception history insight intimidation
    investigation medicine nature perception performance persuasion
    religion sleight_of_hand stealth survival
  ].freeze

  SAVING_THROW_ABILITIES = %w[strength dexterity constitution intelligence wisdom charisma].freeze

  def initialize(character, params = {})
    @character = character
    # Convert ActionController::Parameters to hash if needed
    if params.is_a?(ActionController::Parameters)
      # Use to_unsafe_h to convert permitted parameters to hash, then make it indifferent
      @params = params.to_unsafe_h.with_indifferent_access
    elsif params.is_a?(Hash)
      @params = params.with_indifferent_access
    else
      @params = params
    end
    @errors = []
  end

  def validate_and_update
    validate!
    return false if @errors.any?

    apply_archetype_rules!
    true
  end

  def valid?
    validate!
    @errors.empty?
  end

  # Returns the params with archetype rules applied
  def updated_params
    validate!
    return @params if @errors.any?

    apply_archetype_rules!
    @params
  end

  private

  def validate!
    @errors = []

    validate_level
    validate_archetype if @params[:archetype].present?
    validate_proficiencies if @params[:proficiencies].present?
    validate_ability_scores
    validate_current_spell_list if @params[:current_spell_list_id].present?

    @errors
  end

  def validate_level
    level = @params[:level] || @character.level
    return unless level.present?

    level = level.to_i
    if level < 1 || level > 20
      @errors << "Level must be between 1 and 20"
    end
  end

  def validate_archetype
    archetype_name = @params[:archetype] || @character.archetype&.name
    return unless archetype_name.present?

    unless Archetypes.names.include?(archetype_name.to_sym)
      @errors << "Invalid archetype: #{archetype_name}"
    end
  end

  def validate_proficiencies
    return unless @params[:proficiencies].present?

    archetype_obj = get_archetype
    return unless archetype_obj

    provided_proficiencies = Array(@params[:proficiencies]).map(&:to_s).map(&:downcase)
    valid_skills = extract_valid_skills(archetype_obj)

    provided_proficiencies.each do |proficiency|
      proficiency_downcase = proficiency.downcase
      
      # Check if it's a saving throw proficiency
      if SAVING_THROW_ABILITIES.include?(proficiency_downcase)
        saving_throws = archetype_obj.saving_throw_proficiencies.map(&:downcase)
        unless saving_throws.include?(proficiency_downcase)
          @errors << "Saving throw proficiency '#{proficiency}' is not valid for #{archetype_obj.name}"
        end
      # Check if it's a skill
      elsif DND_SKILLS.include?(proficiency_downcase)
        # It's a D&D skill, validate against archetype's valid skills
        unless valid_skills.empty? || valid_skills.include?(proficiency_downcase)
          @errors << "Skill proficiency '#{proficiency}' is not valid for #{archetype_obj.name}. Valid skills: #{valid_skills.join(', ')}"
        end
      else
        # Might be a weapon/armor/tool proficiency - allow it for now
        # Could add stricter validation later if needed
      end
    end
  end

  def validate_ability_scores
    abilities = %w[strength dexterity constitution intelligence wisdom charisma]
    abilities.each do |ability|
      value = @params[ability.to_sym] || @character.send(ability)
      next unless value.present?

      value = value.to_i
      if value < 1 || value > 30
        @errors << "#{ability.capitalize} must be between 1 and 30"
      end
    end
  end

  def validate_current_spell_list
    spell_list_id = @params[:current_spell_list_id]
    
    # Allow clearing the spell list (nil, empty string, or 'null')
    return if spell_list_id.blank? || spell_list_id.to_s == 'null' || spell_list_id.to_s == ''

    begin
      # For new characters, we can't validate ownership yet since they don't have an ID
      # This validation will pass on create and be checked when the character is saved
      return unless @character.persisted?
      
      # Ensure the spell list exists and belongs to this character
      spell_list = SpellList.find_by(id: spell_list_id)
      
      if spell_list.nil?
        @errors << "Spell list with id #{spell_list_id} not found"
        return
      end

      # Check if the spell list belongs to this character
      unless spell_list.character_id == @character.id
        @errors << "Spell list does not belong to this character"
      end
    rescue => e
      # Catch any exceptions that might occur (database errors, etc.)
      @errors << "Error validating spell list: #{e.message}"
    end
  end

  def apply_archetype_rules!
    archetype_obj = get_archetype
    return unless archetype_obj

    # Ensure saving throw proficiencies are included
    apply_saving_throw_proficiencies(archetype_obj)

    # Update hit points if level changed
    apply_hit_point_calculation if level_changed?

    # Ensure spellcasting-related data is consistent
    ensure_spellcasting_consistency(archetype_obj) if archetype_obj.caster?
  end

  def apply_saving_throw_proficiencies(archetype_obj)
    saving_throws = archetype_obj.saving_throw_proficiencies.map { |s| s.downcase }
    
    # Get current proficiencies from params or character
    current_proficiencies = if @params[:proficiencies].present?
      Array(@params[:proficiencies]).map(&:to_s).map(&:downcase)
    elsif @character.persisted?
      @character.proficiencies.map(&:to_s).map(&:downcase)
    else
      []
    end
    
    # Add archetype saving throw proficiencies to params if not already present
    updated_proficiencies = current_proficiencies.dup
    saving_throws.each do |saving_throw|
      unless updated_proficiencies.include?(saving_throw)
        updated_proficiencies << saving_throw
      end
    end
    
    @params[:proficiencies] = updated_proficiencies
  end

  def apply_hit_point_calculation
    level = (@params[:level] || @character.level).to_i
    return if level < 1

    # If character is new or level increased, we might want to update current_hitpoints
    # For now, we'll just ensure total_hitpoints is calculated correctly
    # The character model already has a total_hitpoints method that calculates this
    # We could update current_hitpoints here if needed, but that might be better handled
    # by the user or a separate leveling service
  end

  def ensure_spellcasting_consistency(archetype_obj)
    level = (@params[:level] || @character.level).to_i
    return if level < 1

    # Validate that spell slots are available at this level
    spell_slots = archetype_obj.spell_slots_at_level(level)
    
    # If character has a spell list, we could validate that it doesn't exceed
    # spells known/prepared limits here
    # This could be expanded later
  end

  def get_archetype
    archetype_name = @params[:archetype] || @character.archetype&.name
    return nil unless archetype_name.present?

    begin
      Archetypes.new(archetype_name)
    rescue
      nil
    end
  end

  def extract_valid_skills(archetype_obj)
    skill_prof_text = archetype_obj.skill_proficiencies.first || ""
    
    # Handle "Any X skills" - all skills are valid
    if skill_prof_text =~ /^any\s+\d+\s+skills?$/i
      return DND_SKILLS
    end
    
    # Handle case where it says "Any three skills" - all skills are valid
    if skill_prof_text.downcase.include?('any') && skill_prof_text.downcase.include?('skill')
      return DND_SKILLS
    end
    
    # Parse strings like "Choose two from Arcana, History, Investigation, Medicine, Nature, Perception, Sleight of Hand"
    # or "Choose two skills from Acrobatics, Animal Handling, ..."
    # Extract skills from between "from" and the end
    if skill_prof_text =~ /(?:skills?\s+)?from\s+(.+?)$/i
      skills_text = $1
      skills = skills_text.split(',').map(&:strip)
      
      # Normalize skill names to match DND_SKILLS format
      skills.map do |skill|
        # Remove leading "and" if present
        skill = skill.sub(/^\s*and\s+/i, '')
        # Convert "Sleight of Hand" -> "sleight_of_hand", "Arcana" -> "arcana", etc.
        skill.downcase.gsub(/\s+/, '_')
      end.select { |skill| DND_SKILLS.include?(skill) }
    else
      []
    end
  end

  def level_changed?
    return false unless @params[:level].present?
    @params[:level].to_i != @character.level.to_i
  end
end

