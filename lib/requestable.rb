module Requestable
  def get(url)
    response = Faraday.get(url + paths.shift)
    doc = Nokogiri::HTML(response.body)
  end
end