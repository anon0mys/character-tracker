# The anthropic gem (journal page transcription) calls Class#subclasses while it
# loads. ActiveSupport 6.1 replaces Ruby's own with one built on
# Class#descendants, and both compare classes using ==, which the gem's model
# classes override, so loading it raises NameError (`uninitialized constant
# Anthropic::Beta`). Find direct subclasses comparing by identity instead -
# what == means for every other class. Rails 7 keeps Ruby's built-in
# subclasses; delete this patch after upgrading.
class Class
  def subclasses
    ObjectSpace.each_object(singleton_class).select do |klass|
      !klass.singleton_class? && klass.superclass.equal?(self)
    end
  end
end

require "anthropic"
