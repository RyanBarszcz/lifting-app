import { z } from "zod";

export const setSchema = z.object({
  setNumber: z.number(),
  weight: z.number(),
  reps: z.number(),
});

export const exerciseSchema = z.object({
  exerciseId: z.string(),
  sets: z.array(setSchema).min(1),
});

export const completeSessionSchema = z.object({
  title: z.string(),
  endNote: z.string().nullable(),
  exercises: z.array(exerciseSchema).min(1),
});