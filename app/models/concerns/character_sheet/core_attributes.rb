class CharacterSheet::CoreAttributes < ValidatedObject
  Attributes = %i[
    strength dexterity constitution
    intelligence wisdom charisma
  ]
end