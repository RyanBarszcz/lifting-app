import { WorkoutExercise } from "@/types";

export function cleanExercises(exercises: WorkoutExercise[]) {
  return exercises
    .map(ex => ({
      exerciseId: ex.exerciseId,
      sets: ex.sets
        .filter(s => s.completed && s.weight > 0 && s.reps > 0)
        .map((s, i) => ({
          setNumber: i + 1,
          weight: s.weight,
          reps: s.reps,
        }))
    }))
    .filter(ex => ex.sets.length > 0);
}