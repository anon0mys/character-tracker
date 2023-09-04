class CharacterSerializer < Blueprinter::Base
  identifier :id

  fields :name
  field :archetype, name: :class

  association :character_sheet, blueprint: CharacterSheetSerializer
end