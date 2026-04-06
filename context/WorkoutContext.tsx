"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { DBExercise, WorkoutExercise, WorkoutState, StartExercise } from "@/types";

// interface WorkoutSet {
//     setNumber: number;
//     reps: number;
//     weight: number | null;
//     completed: boolean;
// }

// interface WorkoutExercise {
//     id: string;
//     exerciseId: string;
//     name: string;
//     sets: WorkoutSet[];
// }

// interface WorkoutState {
//     sessionId: string | null;
//     startedAt: number | null;
//     exercises: WorkoutExercise[];
// }

// interface StartExercise {
//     exerciseId: string;
//     name: string;
//     sets: {
//         setNumber: number;
//         reps: number;
//     }[];
// }



interface WorkoutContextType {
    workout: WorkoutState;
    startWorkout: (sessionId: string) => void;
    addExercises: (newExercises: DBExercise[]) => void;
    resetWorkout: () => void;
    startWorkoutWithExercises: (
        sessionId: string,
        exercises: StartExercise[]
    ) => void;
    reorderExercises: (newOrder: WorkoutExercise[]) => void;
    deleteExercise: (id: string) => void;
}

const WorkoutContext = createContext<WorkoutContextType | null>(null);

export function WorkoutProvider({ children }: { children: React.ReactNode }) {
    const [workout, setWorkout] = useState<WorkoutState>({
        sessionId: null,
        startedAt: null,
        exercises: [],
    });

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
        });
    };

    const startWorkoutWithExercises = (
        sessionId: string,
        exercises: StartExercise[]
    ) => {
        const builtExercises: WorkoutExercise[] = exercises.map((ex) => ({
            id: crypto.randomUUID(),
            exerciseId: ex.exerciseId,
            name: ex.name,
            sets: ex.sets.map((set) => ({
                setNumber: set.setNumber,
                reps: set.reps,
                weight: null,
                completed: false,
            })),
        }));

        setWorkout({
            sessionId,
            startedAt: Date.now(),
            exercises: builtExercises,
        });

        console.log("Routine built exercises:", builtExercises);
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
