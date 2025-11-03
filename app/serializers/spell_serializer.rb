class SpellSerializer < Blueprinter::Base
  identifier :id

  fields :id, :archetypes, :casting_time, :components, :description,
    :duration, :level, :name, :range, :school
end
