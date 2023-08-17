class ValidatedObject
  Attributes = []

  def initialize(attrs)
    @attrs = validate!(attrs)
  end

  def to_h
    @attrs.to_h
  end

  private

  def validate!(attrs)
    self.class::Attributes.map do |attr|
      if !attrs.has_key?(attr)
        raise Exceptions::ValidationError
      end
    end

    attrs
  end
end