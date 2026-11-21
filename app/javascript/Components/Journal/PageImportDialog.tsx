import React, { useEffect, useRef, useState } from "react";
import { Camera, Loader2, Trash2, X } from "lucide-react";
import { Client, IJournalDraftEntry, IJournalPageImport } from "../../Api";
import { useAuth } from "../../Auth";
import { announceSessionExpired } from "../../Auth/session";
import { Button, Input, Label, Textarea, toast } from "../ui";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

/** Longest edge photos are shrunk to before upload: legible, and cheap to send. */
const MAX_EDGE = 2000;
const JPEG_QUALITY = 0.85;
const MAX_PAGES = 20;
const POLL_MS = 4000;

/** A phone photo as a JPEG no bigger than MAX_EDGE, upright per its EXIF. */
const shrink = async (file: File): Promise<Blob> => {
  try {
    const bitmap = await createImageBitmap(file, {
      imageOrientation: "from-image",
    });
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas
      .getContext("2d")!
      .drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY),
    );
    return blob ?? file;
  } catch {
    return file; // a format the browser can't decode: let the server judge it
  }
};

interface PageImportDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  gameId: number;
  /** Reopen an import already under way instead of starting a new one. */
  importId?: number | null;
  /** Entries were added to the journal. */
  onAdded: () => void;
  /** The import changed status (started, failed, discarded...). */
  onChanged?: () => void;
}

/**
 * Photographed notebook pages into journal entries: pick photos, Claude reads
 * them in the background, review and edit the drafts, then add them.
 */
const PageImportDialog = ({
  open,
  setOpen,
  gameId,
  importId,
  onAdded,
  onChanged,
}: PageImportDialogProps) => {
  const auth = useAuth();
  const token = auth.getToken();
  const client = Client();
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [record, setRecord] = useState<IJournalPageImport | null>(null);
  const [drafts, setDrafts] = useState<IJournalDraftEntry[]>([]);
  const [adding, setAdding] = useState(false);
  const picker = useRef<HTMLInputElement>(null);
  const base = `/games/${gameId}/journal_page_imports`;

  const take = (next: IJournalPageImport) => {
    setRecord(next);
    if (next.status === "ready") setDrafts(next.entries);
  };

  // Open on an existing import, or start fresh.
  useEffect(() => {
    if (!open) return;
    setFiles([]);
    setRecord(null);
    setDrafts([]);
    if (importId)
      client
        .get({ path: `${base}/${importId}`, token })
        .then((r) => take(r.data))
        .catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, importId]);

  // While Claude reads, check back every few seconds.
  useEffect(() => {
    if (!open || record?.status !== "transcribing") return;
    const timer = setInterval(() => {
      client
        .get({ path: `${base}/${record.id}`, token })
        .then((r) => {
          take(r.data);
          if (r.data.status !== "transcribing") onChanged?.();
        })
        .catch(() => undefined);
    }, POLL_MS);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, record?.id, record?.status]);

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    setFiles((current) =>
      [...current, ...Array.from(list)].slice(0, MAX_PAGES),
    );
  };

  // Multipart, so straight to fetch rather than the JSON client.
  const upload = async () => {
    setUploading(true);
    try {
      const form = new FormData();
      for (const [index, file] of files.entries())
        form.append("pages[]", await shrink(file), `page-${index + 1}.jpg`);
      const response = await fetch(`${process.env.API_BASE_URL}${base}`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
      });
      if (response.status === 401) return announceSessionExpired();
      const json = await response.json().catch(() => ({}));
      if (!response.ok)
        throw new Error(json.errors?.[0] ?? "The pages couldn't be uploaded");
      take(json.data);
      onChanged?.();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error?.message ?? "Try again",
      });
    } finally {
      setUploading(false);
    }
  };

  const retry = () =>
    record &&
    client
      .post({
        path: `${base}/${record.id}/retry`,
        token,
        showSuccessToast: false,
      })
      .then((r) => take(r.data))
      .catch(() => undefined);

  const discard = () =>
    record &&
    client
      .destroy({
        path: `${base}/${record.id}`,
        token,
        successMessage: "Import discarded",
      })
      .then(() => {
        onChanged?.();
        setOpen(false);
      })
      .catch(() => undefined);

  const add = () => {
    if (!record) return;
    setAdding(true);
    client
      .post({
        path: `${base}/${record.id}/confirm`,
        payload: { entries: drafts },
        token,
        successMessage: `Added ${drafts.length} ${drafts.length === 1 ? "entry" : "entries"} to the journal`,
      })
      .then(() => {
        onAdded();
        onChanged?.();
        setOpen(false);
      })
      .catch(() => undefined)
      .finally(() => setAdding(false));
  };

  // Closing mid-review keeps the edits for later.
  const close = (next: boolean) => {
    if (!next && record?.status === "ready")
      client
        .patch({
          path: `${base}/${record.id}`,
          payload: { entries: drafts },
          token,
          showSuccessToast: false,
        })
        .catch(() => undefined);
    setOpen(next);
  };

  const editDraft = (index: number, changes: Partial<IJournalDraftEntry>) =>
    setDrafts((current) =>
      current.map((draft, i) =>
        i === index ? { ...draft, ...changes } : draft,
      ),
    );
  const undated = drafts.filter((draft) => !draft.played_on).length;

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-h-[92vh] overflow-y-auto border-border bg-card sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            Import journal pages
          </DialogTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Photograph notebook pages and Claude turns them into journal
            entries. You review everything before it's added.
          </p>
        </DialogHeader>

        {!record && (
          <div className="flex flex-col gap-4">
            <input
              ref={picker}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => picker.current?.click()}
              className="flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-[14px] border border-dashed border-border-strong bg-secondary text-[14px] text-foreground-2"
            >
              <Camera className="h-6 w-6" />
              Take or choose photos of your pages
              <span className="font-mono text-[11px] text-muted-foreground">
                up to {MAX_PAGES} pages, in reading order
              </span>
            </button>
            {files.length > 0 && (
              <ol className="flex flex-col gap-1">
                {files.map((file, index) => (
                  <li
                    key={`${file.name}-${index}`}
                    className="flex items-center gap-2 text-[13px]"
                  >
                    <span className="w-14 font-mono text-[11px] text-muted-foreground">
                      page {index + 1}
                    </span>
                    <span className="min-w-0 flex-grow truncate">
                      {file.name}
                    </span>
                    <button
                      type="button"
                      aria-label={`Remove page ${index + 1}`}
                      onClick={() =>
                        setFiles((current) =>
                          current.filter((_, i) => i !== index),
                        )
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-[8px] text-muted-foreground hover:bg-secondary"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ol>
            )}
            <Button
              type="button"
              disabled={files.length === 0 || uploading}
              onClick={upload}
              className="h-11 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {uploading
                ? "Uploading…"
                : `Transcribe ${files.length || ""} ${files.length === 1 ? "page" : "pages"}`}
            </Button>
          </div>
        )}

        {record?.status === "transcribing" && (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
            <p className="text-[15px] font-semibold">
              Reading {record.page_count}{" "}
              {record.page_count === 1 ? "page" : "pages"}…
            </p>
            <p className="max-w-sm text-[13px] text-foreground-2">
              This usually takes a minute or two. You can close this; it keeps
              going, and the journal shows when it's ready to review.
            </p>
          </div>
        )}

        {record?.status === "failed" && (
          <div className="flex flex-col gap-3 py-4">
            <p className="text-[14px] text-foreground-2">{record.error}</p>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={retry}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Try again
              </Button>
              <Button type="button" variant="outline" onClick={discard}>
                Discard
              </Button>
            </div>
          </div>
        )}

        {record?.status === "ready" && (
          <div className="flex flex-col gap-4">
            {drafts.length === 0 && (
              <p className="text-[14px] text-foreground-2">
                No entries were found on these pages.
              </p>
            )}
            {drafts.map((draft, index) => (
              <section
                key={index}
                className="flex flex-col gap-3 rounded-[14px] border border-border bg-secondary p-4"
              >
                <div className="flex flex-wrap items-end gap-3">
                  <div className="flex flex-col gap-1">
                    <Label
                      htmlFor={`draft-date-${index}`}
                      className="text-[12px]"
                    >
                      Played on
                      {draft.date_estimated && (
                        <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
                          estimated
                        </span>
                      )}
                    </Label>
                    <Input
                      id={`draft-date-${index}`}
                      type="date"
                      value={draft.played_on ?? ""}
                      onChange={(e) =>
                        editDraft(index, {
                          played_on: e.target.value || null,
                          date_estimated: false,
                        })
                      }
                      className="h-10 w-[160px] font-mono"
                    />
                  </div>
                  <div className="flex min-w-[180px] flex-grow flex-col gap-1">
                    <Label
                      htmlFor={`draft-title-${index}`}
                      className="text-[12px]"
                    >
                      Title
                    </Label>
                    <Input
                      id={`draft-title-${index}`}
                      value={draft.title}
                      onChange={(e) =>
                        editDraft(index, { title: e.target.value })
                      }
                      className="h-10"
                    />
                  </div>
                  <button
                    type="button"
                    aria-label={`Leave out "${draft.title || "Untitled"}"`}
                    onClick={() =>
                      setDrafts((current) =>
                        current.filter((_, i) => i !== index),
                      )
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-[8px] text-muted-foreground hover:bg-card"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <Textarea
                  aria-label={`Notes for "${draft.title || "Untitled"}"`}
                  value={draft.body}
                  onChange={(e) => editDraft(index, { body: e.target.value })}
                  rows={Math.min(
                    14,
                    Math.max(5, draft.body.split("\n").length + 1),
                  )}
                  className="font-mono text-[12.5px] leading-[1.6]"
                />
                <p className="font-mono text-[11px] text-muted-foreground">
                  {draft.pages.length > 0 &&
                    `from page ${draft.pages.join(", ")}`}
                  {draft.unreadable.length > 0 &&
                    ` · check: ${draft.unreadable.join(", ")}`}
                </p>
              </section>
            ))}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                disabled={drafts.length === 0 || undated > 0 || adding}
                onClick={add}
                className="h-11 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Add {drafts.length} {drafts.length === 1 ? "entry" : "entries"}
              </Button>
              <Button type="button" variant="outline" onClick={discard}>
                Discard
              </Button>
              {undated > 0 && (
                <span className="text-[13px] text-foreground-2">
                  Give every entry a date to add them.
                </span>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PageImportDialog;
