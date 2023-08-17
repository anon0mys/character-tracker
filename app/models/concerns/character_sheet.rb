class CharacterSheet
  def initialize
    @core_attributes = CoreAttributes.new
    @ac = 0
    @initiative = 0
    @speed = 0
    @perception = 0
    @proficiency_bonus = 0
    @spell_attack_mod = 0
    @spell_save_dc = 0
    @concentration_check = 0
  end
end