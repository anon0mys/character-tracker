import { useCallback, useEffect, useState } from "react";
import { Client, IHoldingType } from "../../Api";
import { useAuth } from "../../Auth";
import { useError } from "../../Errors";

/** Every holding in a campaign, light (no descriptions); callers group it. */
export const useCampaignHoldings = (gameId?: number) => {
  const auth = useAuth();
  const client = Client();
  const errors = useError();
  const [holdings, setHoldings] = useState<IHoldingType[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    if (!gameId) return;
    client
      .get({ path: `/games/${gameId}/holdings`, token: auth.getToken() })
      .then((res) => setHoldings(res.data ?? []))
      .catch((err) => errors.setError(err))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { holdings, loading, reload };
};
