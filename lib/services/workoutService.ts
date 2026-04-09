import { getSessions } from "@/lib/api/sessions";
import { cleanExercises } from "@/lib/utils/cleanExercises";
import { completeSession } from "@/lib/api/sessions";
import { completeSessionSchema } from "@/lib/validators/session";

export async function fetchWorkouts(token: string, page: number) {
  const data = await getSessions(token, page);

  return {
    sessions: data?.sessions ?? [],
    hasMore: data?.hasMore ?? false,
  };
}

export async function finishWorkout(
  token: string,
  sessionId: string,
  workout: any
) {
  const cleaned = cleanExercises(workout.exercises);

  if (cleaned.length === 0) {
    throw new Error("No valid sets");
  }

  const payload = {
    exercises: cleaned,
    endNote: workout.notes?.trim() || null,
    title: workout.title?.trim() || "Workout",
  };

  const validated = completeSessionSchema.parse(payload);

  return completeSession(token, sessionId, validated);
}