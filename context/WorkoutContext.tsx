"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { DBExercise, WorkoutExercise, WorkoutState, StartExercise } from "@/types";
import { useAuth } from "@clerk/nextjs";


interface WorkoutContextType {
    workout: WorkoutState;
    startWorkout: (sessionId: string) => void;
    addExercises: (newExercises: DBExercise[]) => void;
    resetWorkout: () => void;
    startWorkoutWithExercises: (
        sessionId: string | null,
        exercises: StartExercise[],
        templateName?: string | null
    ) => Promise<void>;
    reorderExercises: (newOrder: WorkoutExercise[]) => void;
    deleteExercise: (id: string) => void;
    updateWorkoutMeta: (data: { title?: string; notes?: string }) => void;
    updateWorkoutExercises: (exercises: WorkoutExercise[]) => void;
}

const WorkoutContext = createContext<WorkoutContextType | null>(null);

export function WorkoutProvider({ children }: { children: React.ReactNode }) {
    const [workout, setWorkout] = useState<WorkoutState>({
        sessionId: null,
        startedAt: null,
        exercises: [],
        templateName: null,
        title: "Workout",
        notes: "",
    });
    const { getToken } = useAuth();

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem("activeWorkout");
        if (stored) {
            setWorkout(JSON.parse(stored));
        }
    }, []);

    // Save to localStorage whenever workout changes
    useEffect(() => {
        localStorage.setItem("activeWorkout", JSON.stringify(workout));
    }, [workout]);

    const startWorkout = (sessionId: string) => {
        setWorkout({
            sessionId,
            startedAt: Date.now(),
            exercises: [],
            templateName: null,
            title: "Workout",
            notes: "",
        });
    };

    const addExercises = (newExercises: DBExercise[]) => {
        setWorkout((prev) => {
            const existingIds = new Set(prev.exercises.map(e => e.exerciseId));

            const builtExercises: WorkoutExercise[] = newExercises
                .filter(ex => !existingIds.has(ex.id))
                .map((ex) => ({
                    id: crypto.randomUUID(),      // UI ID
                    exerciseId: ex.id,            // DB ID 
                    name: ex.name,
                    sets: [
                        {
                            setNumber: 1,
                            reps: 10,
                            weight: null,
                            completed: false,
                        },
                    ],
                }));

            return {
                ...prev,
                exercises: [
                    ...prev.exercises,
                    ...builtExercises,
                ],
            };
        });
    };

    const deleteExercise = (id: string) => {
        setWorkout((prev) => ({
            ...prev,
            exercises: prev.exercises.filter((e) => e.id !== id),
        }));
    };


    const resetWorkout = () => {
        localStorage.removeItem("activeWorkout");
        setWorkout({
            sessionId: null,
            startedAt: null,
            exercises: [],
            templateName: null,
            title: "Workout",
            notes: "",
        });
    };

    const ensureSession = async () => {
        const token = await getToken();

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/sessions/start`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!res.ok) {
            throw new Error("Failed to create session");
        }

        const data = await res.json();
        return data.id;
    };

    const startWorkoutWithExercises = async (
        sessionId: string | null,
        exercises: StartExercise[],
        templateName?: string | null,
    ) => {
        const builtExercises: WorkoutExercise[] = exercises.map((ex) => ({
            id: crypto.randomUUID(),
            exerciseId: ex.exerciseId,
            name: ex.name,
            sets: ex.sets.map((set) => ({
                setNumber: set.setNumber,
                reps: set.reps,
                weight: set.weight ?? null,
                completed: false,
            })),
        }));

        const finalSessionId = sessionId ?? await ensureSession();


        setWorkout({
            sessionId: finalSessionId,
            startedAt: Date.now(),
            exercises: builtExercises,
            templateName: templateName ?? null,
            title: templateName ?? "Workout", // auto-fill from routine
            notes: "",
        });

        // console.log("Routine built exercises:", builtExercises);
    };

    const updateWorkoutMeta = (data: { title?: string; notes?: string }) => {
        setWorkout(prev => ({
            ...prev,
            ...data,
        }));
    };

    const updateWorkoutExercises = (newExercises: WorkoutExercise[]) => {
        setWorkout(prev => ({
            ...prev,
            exercises: newExercises,
        }));
    };


    const reorderExercises = (newOrder: WorkoutExercise[]) => {
        setWorkout((prev) => ({
            ...prev,
            exercises: newOrder,
        }));
    };

    return (
        <WorkoutContext.Provider
            value={{
                workout,
                startWorkout,
                addExercises,
                deleteExercise,
                resetWorkout,
                startWorkoutWithExercises,
                reorderExercises,
                updateWorkoutMeta,
                updateWorkoutExercises,
            }}
        >
            {children}
        </WorkoutContext.Provider>
    );
}

export function useWorkout() {
    const context = useContext(WorkoutContext);
    if (!context) {
        throw new Error("useWorkout must be used within WorkoutProvider");
    }
    return context;
}
