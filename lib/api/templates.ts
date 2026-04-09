import api from "@/lib/api";

export async function createRoutine(token: string, data: any) {
  const res = await api.post("/templates/create", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}

export async function getRoutines(token: string) {
  const res = await api.get("/templates", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}

export async function deleteRoutine(token: string, id: string) {
  const res = await api.delete(`/templates/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}

export async function startSession(token: string) {
  const res = await api.post(
    "/sessions/start",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
}