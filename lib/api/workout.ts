import api from "@/lib/api";

export async function getPreviousSets(token: string, exerciseIds: string[]) {
  const ids = exerciseIds.join(",");

  const res = await api.get(`/workout/previous?exerciseIds=${ids}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}