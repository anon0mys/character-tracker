# Who is writing in which entry, for the campaign's journal list. Nothing is
# stored: editors ping every few seconds and listeners expire stale names.
class JournalPresenceChannel < ApplicationCable::Channel
  def subscribed
    game = current_user.games.find_by(id: params[:game_id])
    return reject unless game

    stream_for game
  end

  def present(data)
    entry = JournalEntry.where(game_id: current_user.games.select(:id)).find_by(id: data["entry_id"])
    return unless entry

    self.class.broadcast_to(entry.game,
      { entry_id: entry.id, user_id: current_user.id, name: data["name"].to_s.first(60) })
  end
end
