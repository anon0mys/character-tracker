import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Copy, Link2, X } from "lucide-react";
import { Client, GameRole, IGameInvite, IGameMember } from "../../Api";
import { useAuth } from "../../Auth";
import { Button } from "../ui";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const ROLE_LABEL: Record<GameRole, string> = {
  player: "Player",
  dm: "DM",
  admin: "Admin",
};
const ROLES: GameRole[] = ["player", "dm", "admin"];
const isManager = (role?: GameRole) => role === "admin" || role === "dm";

const joinUrl = (token: string) => `${window.location.origin}/join/${token}`;

const expiresIn = (iso: string) => {
  const days = Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
  return days <= 1 ? "expires today" : `expires in ${days} days`;
};

interface MembersDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  gameId: number;
}

/**
 * Who is in the campaign. Admins and DMs also change roles, remove people and
 * make invite links: a player link anyone can use, or a one-time DM link.
 */
const MembersDialog = ({ open, setOpen, gameId }: MembersDialogProps) => {
  const auth = useAuth();
  const token = auth.getToken();
  const client = Client();
  const navigate = useNavigate();
  const [members, setMembers] = useState<IGameMember[]>([]);
  const [invites, setInvites] = useState<IGameInvite[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  const me = members.find((m) => m.you);
  const managing = isManager(me?.role);

  const loadMembers = () =>
    client
      .get({ path: `/games/${gameId}/members`, token })
      .then((r) => setMembers(r.data ?? []))
      .catch(() => setMembers([]));
  const loadInvites = () =>
    client
      .get({ path: `/games/${gameId}/invites`, token })
      .then((r) => setInvites(r.data ?? []))
      .catch(() => setInvites([]));

  useEffect(() => {
    if (open) loadMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, gameId]);

  useEffect(() => {
    if (open && managing) loadInvites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, managing, gameId]);

  const changeRole = (member: IGameMember, role: GameRole) =>
    client
      .patch({
        path: `/games/${gameId}/members/${member.id}`,
        payload: { member: { role } },
        token,
        successMessage: `${member.name} is now ${ROLE_LABEL[role]}`,
      })
      .then(loadMembers)
      .catch(() => undefined);

  const remove = (member: IGameMember) =>
    client
      .destroy({
        path: `/games/${gameId}/members/${member.id}`,
        token,
        successMessage: member.you
          ? "You left the campaign"
          : `${member.name} was removed`,
      })
      .then(() => {
        if (member.you) {
          setOpen(false);
          navigate("/dashboard");
        } else {
          loadMembers();
        }
      })
      .catch(() => undefined);

  const createInvite = (role: "player" | "dm") =>
    client
      .post({
        path: `/games/${gameId}/invites`,
        payload: { invite: { role } },
        token,
        showSuccessToast: false,
      })
      .then((r) => {
        loadInvites();
        copy(r.data);
      })
      .catch(() => undefined);

  const revoke = (invite: IGameInvite) =>
    client
      .destroy({
        path: `/games/${gameId}/invites/${invite.id}`,
        token,
        successMessage: "Invite link revoked",
      })
      .then(loadInvites)
      .catch(() => undefined);

  const copy = (invite: IGameInvite) =>
    navigator.clipboard
      ?.writeText(joinUrl(invite.token))
      .then(() => {
        setCopied(invite.id);
        setTimeout(() => setCopied(null), 2000);
      })
      .catch(() => undefined);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-card sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Members</DialogTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            {managing
              ? "Invite your players and DM, or change who runs the campaign."
              : "Everyone playing in this campaign."}
          </p>
        </DialogHeader>

        <ul className="flex flex-col divide-y divide-border">
          {members.map((member) => (
            <li
              key={member.id}
              className="flex min-h-[56px] items-center gap-3 py-2"
            >
              <div className="flex min-w-0 flex-grow flex-col">
                <span className="truncate text-[14px] font-semibold">
                  {member.name}
                  {member.you && (
                    <span className="font-normal text-muted-foreground">
                      {" "}
                      · you
                    </span>
                  )}
                </span>
                <span className="truncate font-mono text-[11px] text-muted-foreground">
                  {member.characters.length > 0
                    ? member.characters.join(", ")
                    : "no character yet"}
                </span>
              </div>
              {managing ? (
                <Select
                  value={member.role}
                  onValueChange={(role) => changeRole(member, role as GameRole)}
                >
                  <SelectTrigger
                    aria-label={`${member.name}'s role`}
                    className="h-10 w-[112px]"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {ROLE_LABEL[role]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <span className="rounded-full bg-secondary px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-foreground-2">
                  {ROLE_LABEL[member.role]}
                </span>
              )}
              {(managing || member.you) && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => remove(member)}
                  className="h-10 border-border px-3 text-[13px]"
                >
                  {member.you ? "Leave" : "Remove"}
                </Button>
              )}
            </li>
          ))}
        </ul>

        {managing && (
          <section className="flex flex-col gap-3 border-t border-border pt-4">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="mr-auto font-display text-[18px] font-semibold">
                Invite links
              </h3>
              <Button
                type="button"
                variant="outline"
                onClick={() => createInvite("player")}
                className="h-10 border-border-strong text-[13px]"
              >
                <Link2 className="mr-1 h-4 w-4" />
                Invite players
              </Button>
              <Button
                type="button"
                onClick={() => createInvite("dm")}
                className="h-10 bg-primary text-[13px] text-primary-foreground hover:bg-primary/90"
              >
                <Link2 className="mr-1 h-4 w-4" />
                Invite a DM
              </Button>
            </div>
            <p className="text-[13px] text-foreground-2">
              A player link works for anyone you send it to for two weeks. A DM
              link works once. New links are copied for you.
            </p>
            {invites.map((invite) => (
              <div
                key={invite.id}
                className="flex items-center gap-2 rounded-[10px] border border-border bg-secondary px-3 py-2"
              >
                <div className="flex min-w-0 flex-grow flex-col">
                  <span className="text-[13px] font-semibold">
                    {ROLE_LABEL[invite.role]} link
                  </span>
                  <span className="truncate font-mono text-[11px] text-muted-foreground">
                    {invite.max_uses
                      ? `${invite.uses_count}/${invite.max_uses} used`
                      : `${invite.uses_count} joined`}{" "}
                    · {expiresIn(invite.expires_at)} · by {invite.created_by}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => copy(invite)}
                  className="h-9 border-border px-3 text-[13px]"
                >
                  {copied === invite.id ? (
                    <Check className="mr-1 h-4 w-4" />
                  ) : (
                    <Copy className="mr-1 h-4 w-4" />
                  )}
                  {copied === invite.id ? "Copied" : "Copy link"}
                </Button>
                <button
                  type="button"
                  aria-label={`Revoke ${ROLE_LABEL[invite.role]} link`}
                  onClick={() => revoke(invite)}
                  className="flex h-9 w-9 items-center justify-center rounded-[8px] text-muted-foreground hover:bg-card"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </section>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MembersDialog;
