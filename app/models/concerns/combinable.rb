module Combinable
  def combine_to_hash(list)
    string_list = list.map(&:to_s)
    string_list.zip(string_list).to_h
  end
end
