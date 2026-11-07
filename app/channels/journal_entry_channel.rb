# Live co-editing of one journal entry. Rails never reads the Yjs updates: it
# logs and relays them, and stores the snapshots clients post. Payloads are
# base64 because Action Cable speaks JSON.
#
#   join      → init { state, compacted_through, updates: [[seq, update]] }
#   update    → logged with the next seq, broadcast { update, seq, from }
#   awareness → cursors and names, relayed only
#   snapshot  → { state, body, through_seq } stored; log compacted; mentions synced
class JournalEntryChannel < ApplicationCable::Channel
  def subscribed
    entry = find_entry
    return reject unless entry

    stream_for entry
    transmit(init_payload(entry))
  end

  def update(data)
    entry = find_entry
    seq = entry.append_update!(decode(data["update"]))
    self.class.broadcast_to(entry, { type: "update", update: data["update"], seq:, from: data["from"] })
  end

  # Cursor and name updates (y-protocols awareness): relayed, never stored.
  def awareness(data)
    self.class.broadcast_to(find_entry, { type: "awareness", update: data["update"], from: data["from"] })
  end

  def snapshot(data)
    find_entry.store_snapshot!(state: decode(data["state"]), body: data["body"] || {}, through_seq: data["through_seq"])
  end

  private

  def find_entry
    JournalEntry.where(game_id: current_user.games.select(:id)).find_by(id: params[:entry_id])
  end

  def init_payload(entry)
    {
      type: "init",
      state: entry.ydoc_state && encode(entry.ydoc_state),
      compacted_through: entry.compacted_through,
      updates: entry.pending_updates.map { |row| [row.seq, encode(row.payload)] },
    }
  end

  def encode(bytes) = Base64.strict_encode64(bytes)
  def decode(text) = Base64.strict_decode64(text.to_s)
end
