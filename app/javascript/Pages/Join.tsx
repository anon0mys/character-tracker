import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Client, IInvitePreview } from "../Api";
import { useAuth } from "../Auth";
import { Button } from "../Components/ui";

const ROLE_PHRASE = { player: "as a player", dm: "as the DM" };

/**
 * Where an invite link lands (/join/:token). Signed-out visitors log in or
 * sign up first and come back here; then one click joins the campaign.
 */
const Join = () => {
  const { token: inviteToken } = useParams();
  const auth = useAuth();
  const token = auth.getToken();
  const client = Client();
  const navigate = useNavigate();
  const [invite, setInvite] = useState<IInvitePreview | null>(null);
  const [missing, setMissing] = useState(false);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    client
      .get({ path: `/invites/${inviteToken}`, token })
      .then((r) => setInvite(r.data))
      .catch(() => setMissing(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inviteToken]);

  const join = () => {
    setJoining(true);
    client
      .post({
        path: `/invites/${inviteToken}/accept`,
        token,
        successMessage: `Welcome to ${invite?.game_name}`,
      })
      .then((r) => navigate(`/campaigns/${r.data.game_id}`))
      .catch(() => setJoining(false));
  };

  const alreadyIn =
    invite?.member_role &&
    !(invite.role === "dm" && invite.member_role === "player");

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-5 rounded-2xl bg-card p-6 text-center sm:p-8">
        {missing && (
          <>
            <h2 className="font-display text-2xl font-semibold">
              This invite doesn't exist
            </h2>
            <p className="text-sm text-muted-foreground">
              Check the link, or ask for a new one.
            </p>
          </>
        )}
        {invite && (
          <>
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
              {invite.invited_by} invited you
            </p>
            <h2 className="font-display text-3xl font-semibold">
              {invite.game_name}
            </h2>
            {alreadyIn ? (
              <>
                <p className="text-sm text-foreground-2">
                  You're already in this campaign.
                </p>
                <Link
                  to={`/campaigns/${invite.game_id}`}
                  className="inline-flex min-h-11 items-center rounded-[10px] bg-primary px-5 text-[14px] font-semibold text-primary-foreground"
                >
                  Open the campaign
                </Link>
              </>
            ) : invite.usable ? (
              <>
                <p className="text-sm text-foreground-2">
                  Join {ROLE_PHRASE[invite.role]}.
                </p>
                <Button
                  type="button"
                  onClick={join}
                  disabled={joining}
                  className="h-11 w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Join {invite.game_name}
                </Button>
              </>
            ) : (
              <p className="text-sm text-foreground-2">
                This invite has expired or been used. Ask {invite.invited_by}{" "}
                for a new one.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Join;
