import React, { useState } from "react";
import { Client, ICharacterTrackerType } from "../../../Api";
import { useAuth } from "../../../Auth";
import { useError } from "../../../Errors";
import { Button } from "../../ui";
import TrackerRow from "./TrackerRow";
import TrackerForm from "./TrackerForm";

interface Props {
  characterId: number | string;
  trackers: ICharacterTrackerType[];
  setTrackers: React.Dispatch<React.SetStateAction<ICharacterTrackerType[]>>;
}

const groupByCategory = (
  trackers: ICharacterTrackerType[],
): Record<string, ICharacterTrackerType[]> => {
  return trackers.reduce<Record<string, ICharacterTrackerType[]>>((acc, t) => {
    const key = t.category?.trim() || "Uncategorized";
    acc[key] = acc[key] || [];
    acc[key].push(t);
    return acc;
  }, {});
};

const TrackersSection = ({ characterId, trackers, setTrackers }: Props) => {
  const auth = useAuth();
  const client = Client();
  const errors = useError();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ICharacterTrackerType | null>(null);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (tracker: ICharacterTrackerType) => {
    setEditing(tracker);
    setFormOpen(true);
  };

  const handleSubmit = (
    values: Omit<ICharacterTrackerType, "id" | "character_id" | "current_uses">,
  ) => {
    if (editing?.id) {
      client
        .patch({
          path: `/characters/${characterId}/trackers/${editing.id}`,
          payload: { character_tracker: values },
          token: auth.getToken(),
        })
        .then((response) => {
          setTrackers(
            trackers.map((t) => (t.id === editing.id ? response.data : t)),
          );
          setFormOpen(false);
          setEditing(null);
        })
        .catch((err) => errors.setError(err));
    } else {
      client
        .post({
          path: `/characters/${characterId}/trackers`,
          payload: { character_tracker: { ...values, current_uses: 0 } },
          token: auth.getToken(),
        })
        .then((response) => {
          setTrackers([...trackers, response.data]);
          setFormOpen(false);
        })
        .catch((err) => errors.setError(err));
    }
  };

  const handleUsesUpdate = (
    tracker: ICharacterTrackerType,
    updates: Partial<ICharacterTrackerType>,
  ) => {
    if (!tracker.id) return;
    const previous = trackers;
    const optimistic = trackers.map((t) =>
      t.id === tracker.id ? { ...t, ...updates } : t,
    );
    setTrackers(optimistic);
    client
      .patch({
        path: `/characters/${characterId}/trackers/${tracker.id}`,
        payload: { character_tracker: updates },
        token: auth.getToken(),
        showSuccessToast: false,
      })
      .then((response) => {
        setTrackers((prev) =>
          prev.map((t) => (t.id === tracker.id ? response.data : t)),
        );
      })
      .catch((err) => {
        setTrackers(previous);
        errors.setError(err);
      });
  };

  const handleDelete = (tracker: ICharacterTrackerType) => {
    if (!tracker.id) return;
    client
      .destroy({
        path: `/characters/${characterId}/trackers/${tracker.id}`,
        token: auth.getToken(),
      })
      .then(() => {
        setTrackers(trackers.filter((t) => t.id !== tracker.id));
      })
      .catch((err) => errors.setError(err));
  };

  const grouped = groupByCategory(trackers);
  const categoryKeys = Object.keys(grouped).sort();

  return (
    <div className="bg-card  rounded-xl border border-border shadow-lg p-4 sm:p-6 mt-4 sm:mt-6 mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4">
        <h3 className="text-base sm:text-lg font-bold text-primary">
          Trackers
        </h3>
        <Button onClick={openCreate} size="sm">
          Add Tracker
        </Button>
      </div>
      {trackers.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          No trackers yet. Add one to track features, consumables, or item
          charges.
        </p>
      ) : (
        <div className="space-y-4">
          {categoryKeys.map((cat) => (
            <div key={cat}>
              <h4 className="text-xs uppercase text-muted-foreground font-semibold mb-1">
                {cat}
              </h4>
              <div className="space-y-1">
                {grouped[cat].map((tracker) => (
                  <TrackerRow
                    key={tracker.id}
                    tracker={tracker}
                    onUpdate={(u) => handleUsesUpdate(tracker, u)}
                    onEdit={() => openEdit(tracker)}
                    onDelete={() => handleDelete(tracker)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <TrackerForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        tracker={editing}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default TrackersSection;
