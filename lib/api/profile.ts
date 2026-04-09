import api from "@/lib/api";
import { getCache, setCache } from "@/lib/cache";

export async function getProfile(token: string) {
  const cacheKey = "profile";

  const cached = getCache(cacheKey);
  if (cached) return cached;

  const res = await api.get("/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  setCache(cacheKey, res.data);

  return res.data;
}