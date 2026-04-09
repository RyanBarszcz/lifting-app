import { createRoutine, deleteRoutine, getRoutines } from "@/lib/api/templates";
import { getCache, invalidateCache, setCache } from "../cache";
import { APIRoutine, Routine, RoutineExercise, RoutineSet, RoutineState } from "@/types";

export async function saveRoutine(token: string, routine: RoutineState) {
  const payload = {
    title: routine.title,
    exercises: routine.exercises.map((ex: RoutineExercise, index: number) => ({
      exerciseId: ex.exerciseId,
      orderIndex: index + 1,
      sets: ex.sets.map((set, i) => ({
        setNumber: i + 1,
        reps: set.reps,
      })),
    })),
  };

  return createRoutine(token, payload);
}

export async function fetchRoutines(token: string) {
  const cached = getCache("routines");
  if (cached) return cached;

  const data = await getRoutines(token);

  const formatted = data.map((r: Routine) => ({
    id: r.id,
    title: r.title,
    exercises: r.exercises.map((e) => ({
      id: crypto.randomUUID(),
      exerciseId: e.exerciseId,
      name: e.name,
      sets: e.sets.map((s: RoutineSet) => ({
        id: crypto.randomUUID(),
        reps: s.reps,
      })),
    })),
  }));

  setCache("routines", formatted);

  return formatted;
}

export async function removeRoutine(token: string, id: string) {
  await deleteRoutine(token, id);

  invalidateCache("routines");
}