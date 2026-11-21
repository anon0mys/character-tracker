require "open3"

module Journal
  # Builds the Yjs state the journal editor opens, from TipTap JSON bodies, for
  # entries written on the server (imports). The editor reads ydoc_state, not
  # body, so an entry saved with only a body opens blank.
  #
  #   Journal::Ydoc.states_for([body, body]) # => [binary, binary]
  module Ydoc
    SCRIPT = Rails.root.join("lib/journal/ydoc_from_body.mjs").to_s

    class Error < StandardError; end

    def self.states_for(bodies)
      return [] if bodies.empty?

      out, err, status = Open3.capture3("node", SCRIPT, stdin_data: bodies.to_json, chdir: Rails.root.to_s)
      raise Error, "ydoc_from_body.mjs failed: #{err.strip}" unless status.success?

      JSON.parse(out).map { |state| Base64.strict_decode64(state) }
    end
  end
end
