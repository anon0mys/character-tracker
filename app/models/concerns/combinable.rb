module Combinable
  def combine_to_hash(list)
    list.zip(list).to_h
  end
end