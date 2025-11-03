module Requestable
  def get(url)
    response = Faraday.get(url + paths.shift)
    Nokogiri::HTML(response.body)
  end
end
