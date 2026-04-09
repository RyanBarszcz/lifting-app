import api from "@/lib/api";
import { getCache, setCache, invalidateCachePrefix, invalidateCache } from "@/lib/cache";

export async function getSessions(token: string, page = 1) {
  const cacheKey = `workouts-page-${page}`;

  const cached = getCache(cacheKey);
  if (cached) return cached;

  const res = await api.get(`/sessions?page=${page}&limit=10`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  setCache(cacheKey, res.data);

  return res.data;
}

export async function completeSession(
  token: string,
  sessionId: string,
  data: any
) {
  const res = await api.post(
    `/sessions/${sessionId}/complete`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  // Invalidate cache so homepage refreshes next time
  invalidateCachePrefix("workouts-page-");
  invalidateCache("profile");

  return res.data;
}

export async function deleteSession(token: string, id: string) {
  const res = await api.delete(`/sessions/${id}/delete`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Invalidate everything affected
  invalidateCachePrefix("workouts-page-");
  invalidateCache("profile");

  return res.data;
}