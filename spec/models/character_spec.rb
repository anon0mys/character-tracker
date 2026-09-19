require "rails_helper"

RSpec.describe Character do
  context "validations" do
    it { is_expected.to validate_presence_of :name }
    it { is_expected.to validate_presence_of :age }
    it { is_expected.to validate_presence_of :race }
    it { is_expected.to validate_presence_of :background }
  end

  context "enums" do
    subject(:character) { build(:character) }

    it do
      expect(character).to define_enum_for(:alignment)
        .with_values(combine_to_hash(Character::ALIGNMENTS))
        .backed_by_column_of_type(:string)
    end

    it do
      expect(character).to define_enum_for(:archetype)
        .with_values(combine_to_hash(Archetypes.names))
        .backed_by_column_of_type(:string)
    end
  end

  context "relationships" do
    it { is_expected.to belong_to :user }
    it { is_expected.to belong_to :game }
    it { is_expected.to have_many :spell_lists }
    it { is_expected.to have_many :character_trackers }
    it { is_expected.to have_many(:items).through(:character_items) }
  end

  context "hit points" do
    let(:character) { create(:character, level: 5, constitution: 14) }

    it "computes max_hitpoints as total plus additive bonus" do
      expect(character.max_hitpoints).to eq character.total_hitpoints
      character.update!(max_hitpoints_bonus: 10)
      expect(character.max_hitpoints).to eq character.total_hitpoints + 10
    end

    it "falls back current_hitpoints to max_hitpoints when unset" do
      expect(character.current_hitpoints).to eq character.max_hitpoints
    end
  end

  context "spell slots" do
    it "returns archetype-derived max slots for a caster" do
      character = create(:character, archetype: :artificer, level: 5)
      expect(character.spell_slots_max).to eq [4, 2]
    end

    it "returns [] for non-casters" do
      character = create(:character, archetype: :barbarian, level: 5)
      expect(character.spell_slots_max).to eq []
    end

    it "reports pact_slot_level for warlock only" do
      warlock = create(:character, archetype: :warlock, level: 13)
      artificer = create(:character, archetype: :artificer, level: 13)
      expect(warlock.pact_slot_level).to eq 5
      expect(artificer.pact_slot_level).to be_nil
    end
  end

  context "resting" do
    let(:character) do
      create(:character,
        level: 8,
        constitution: 14,
        current_hitpoints: 10,
        temp_hitpoints: 5,
        max_hitpoints_bonus: 15,
        hit_dice_remaining: 2,
        spell_slots_used: { "1" => 2, "2" => 1 },
        death_save_successes: 1,
        death_save_failures: 2,
        exhaustion: 2)
    end

    it "long rest fully restores hit points, clears bonus, slots and death saves" do
      character.take_long_rest!
      expect(character.reload.temp_hitpoints).to eq 0
      expect(character.max_hitpoints_bonus).to eq 0
      expect(character.current_hitpoints).to eq character.max_hitpoints
      expect(character.spell_slots_used).to eq({})
      expect(character.death_save_successes).to eq 0
      expect(character.death_save_failures).to eq 0
      expect(character.exhaustion).to eq 1
    end

    it "long rest recovers floor(level/2) hit dice, min 1, capped at level" do
      character.take_long_rest!
      expect(character.hit_dice_remaining).to eq 6 # 2 + 4
      character.update!(level: 1, hit_dice_remaining: 0)
      character.take_long_rest!
      expect(character.hit_dice_remaining).to eq 1
    end

    it "long rest resets short/long/dawn trackers but not manual/never" do
      short = create(:character_tracker, character:, reset_on: "short_rest", max_uses: 3, current_uses: 3)
      long = create(:character_tracker, character:, reset_on: "long_rest", max_uses: 3, current_uses: 3)
      dawn = create(:character_tracker, character:, reset_on: "dawn", max_uses: 3, current_uses: 3)
      manual = create(:character_tracker, character:, reset_on: "manual", max_uses: 3, current_uses: 3)
      never = create(:character_tracker, character:, reset_on: "never", max_uses: 3, current_uses: 3)
      character.take_long_rest!
      expect(short.reload.current_uses).to eq 0
      expect(long.reload.current_uses).to eq 0
      expect(dawn.reload.current_uses).to eq 0
      expect(manual.reload.current_uses).to eq 3
      expect(never.reload.current_uses).to eq 3
    end

    it "short rest only resets short_rest trackers" do
      short = create(:character_tracker, character:, reset_on: "short_rest", max_uses: 3, current_uses: 3)
      long = create(:character_tracker, character:, reset_on: "long_rest", max_uses: 3, current_uses: 3)
      character.take_short_rest!
      expect(short.reload.current_uses).to eq 0
      expect(long.reload.current_uses).to eq 3
    end

    it "short rest restores warlock pact slots" do
      warlock = create(:character,
        archetype: :warlock, level: 5, spell_slots_used: { "pact" => 2 })
      warlock.take_short_rest!
      expect(warlock.reload.spell_slots_used["pact"]).to eq 0
    end
  end

  context "level and proficiency" do
    let(:character) { create(:character) }

    it "starts at level 1" do
      expect(character.level).to eq 1
    end

    it "bases proficiency bonus on level" do
      expect(character.proficiency_bonus).to eq 2

      character.level = 4
      expect(character.proficiency_bonus).to eq 2

      character.level = 5
      expect(character.proficiency_bonus).to eq 3

      character.level = 8
      expect(character.proficiency_bonus).to eq 3

      character.level = 9
      expect(character.proficiency_bonus).to eq 4

      character.level = 12
      expect(character.proficiency_bonus).to eq 4

      character.level = 13
      expect(character.proficiency_bonus).to eq 5

      character.level = 16
      expect(character.proficiency_bonus).to eq 5

      character.level = 17
      expect(character.proficiency_bonus).to eq 6
    end
  end

  context "abilities, modifiers, and saves" do
    let(:character) { create(:character) }

    it "defaults to ability scores of 10" do
      expect(character.strength).to eq 10
      expect(character.dexterity).to eq 10
      expect(character.constitution).to eq 10
      expect(character.intelligence).to eq 10
      expect(character.wisdom).to eq 10
      expect(character.charisma).to eq 10
    end

    it "finds values from ability skill symbols" do
      expect(character.value_of(:strength)).to eq 10
    end

    it "calculates modifiers from ability skill symbols" do
      expect(character.modifier_for(:strength)).to eq 0

      character.strength = 12
      expect(character.modifier_for(:strength)).to eq 1

      character.strength = 14
      expect(character.modifier_for(:strength)).to eq 2
    end

    it "calculates proficiency bonus for ability skill symbols" do
      expect(character.proficiency_bonus_for(:strength)).to eq 0

      character.add_proficiency(:strength)
      expect(character.proficiency_bonus_for(:strength)).to eq 2

      character.level = 5
      expect(character.proficiency_bonus_for(:strength)).to eq 3
    end

    it "calculates save fo ability skill symbol" do
      expect(character.save_for(:strength)).to eq 0

      character.add_proficiency(:strength)
      expect(character.save_for(:strength)).to eq 2

      character.strength = 14
      expect(character.save_for(:strength)).to eq 4
    end
  end

  context "calculated attributes" do
    let(:character) { create(:character) }

    it "calculates initiative" do
      expect(character.initiative).to eq 0

      character.initiative_bonus = 3
      expect(character.initiative).to eq 3

      character.dexterity = 14
      expect(character.initiative).to eq 5
    end

    it "calculates perception" do
      expect(character.perception).to eq 10

      character.wisdom = 14
      expect(character.perception).to eq 12
    end

    it "calculates ac" do
      expect(character.ac).to eq 10

      character.ac_bonus = 6
      expect(character.ac).to eq 16

      character.dexterity = 14
      expect(character.ac).to eq 18
    end

    it "calculates concentration" do
      character.proficiencies = []
      expect(character.concentration).to eq 0

      character.constitution = 12
      expect(character.concentration).to eq 1

      character.constitution = 14
      expect(character.concentration).to eq 2

      character.add_proficiency(:constitution)
      expect(character.concentration).to eq 4
    end
  end

  context "spell casting attributes" do
    context "for spell casting archetypes" do
      let(:character) { create(:character, archetype: :artificer) }

      it "calculates spell attack mod" do
        expect(character.spell_attack_mod).to eq 2

        character.intelligence = 16
        expect(character.spell_attack_mod).to eq 5

        character.level = 5
        expect(character.spell_attack_mod).to eq 6
      end

      it "calculates spell attack mod for classes with different casting ability" do
        character.archetype = :cleric
        expect(character.spell_attack_mod).to eq 2

        character.intelligence = 16
        expect(character.spell_attack_mod).to eq 2

        character.wisdom = 16
        expect(character.spell_attack_mod).to eq 5

        character.level = 5
        expect(character.spell_attack_mod).to eq 6
      end

      it "calculates spell save dc" do
        expect(character.spell_save_dc).to eq 10

        character.intelligence = 16
        expect(character.spell_save_dc).to eq 13
      end
    end

    context "for no spell casting archetypes" do
      let(:character) { create(:character, archetype: :barbarian) }

      it "returns nil for spell attack mod" do
        expect(character.spell_attack_mod).to be_nil
      end

      it "returns nil for spell save dc" do
        expect(character.spell_save_dc).to be_nil
      end
    end
  end

  describe "#max_spells_prepared" do
    context "for prepared casters" do
      let(:cleric) { create(:character, archetype: :cleric, wisdom: 18, level: 5, proficiencies: %w[wisdom charisma]) }

      it "calculates based on ability modifier and level" do
        # Wisdom 18 = +4 modifier, Level 5 = +5, Total = 9
        expect(cleric.max_spells_prepared).to eq(9)
      end

      it "has minimum of 1" do
        cleric.wisdom = 8 # -1 modifier
        cleric.level = 1
        expect(cleric.max_spells_prepared).to eq(1)
      end
    end

    context "for known casters" do
      let(:sorcerer) { create(:character, archetype: :sorcerer, level: 5) }

      it "returns spells known at level" do
        max = sorcerer.max_spells_prepared
        expect(max).to be_present
        expect(max).to eq(sorcerer.archetype.spells_known_at_level(5))
      end
    end

    context "for non-casters" do
      let(:barbarian) { create(:character, archetype: :barbarian) }

      it "returns nil" do
        expect(barbarian.max_spells_prepared).to be_nil
      end
    end
  end
end
