import api from "@/lib/api";

export async function getWorkoutById(token: string, id: string) {
  const res = await api.get(`/workout/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}