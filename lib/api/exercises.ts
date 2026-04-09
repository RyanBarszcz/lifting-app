import api from "@/lib/api";
import { getCache, setCache } from "@/lib/cache";

export async function getExercises() {
  const cacheKey = "exercises";

  const cached = getCache(cacheKey);
  if (cached) return cached;

  const res = await api.get("/exercises");

  setCache(cacheKey, res.data);

  return res.data;
}