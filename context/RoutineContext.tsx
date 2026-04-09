"use client";

import { createContext, useContext, useState } from "react";
import { RoutineState, RoutineExercise, RoutineSet, DBExercise } from "@/types";



interface RoutineContextType {
    routine: RoutineState;
    setTitle: (title: string) => void;
    setExercises: React.Dispatch<React.SetStateAction<RoutineExercise[]>>;
    addExercises: (newExercises: DBExercise[]) => void;
    updateExerciseSets: (exerciseId: string, sets: RoutineSet[]) => void;
    deleteExercise: (exerciseId: string) => void;
    resetRoutine: () => void;
    loadRoutineFromWorkout: (exercises: RoutineExercise[], title?: string) => void;
}

const RoutineContext = createContext<RoutineContextType | null>(null);

export const RoutineProvider = ({ children }: { children: React.ReactNode }) => {
    const [routine, setRoutine] = useState<RoutineState>({
        title: "",
        exercises: [],
    });

    // Title
    const setTitle = (title: string) => {
        setRoutine(prev => ({ ...prev, title }));
    };

    // Replace all exercises
    const setExercises = (updater: any) => {
        setRoutine(prev => ({
            ...prev,
            exercises:
                typeof updater === "function"
                    ? updater(prev.exercises)
                    : updater,
        }));
    };

    // Add exercises
    const addExercises = (newExercises: DBExercise[]) => {
        setRoutine(prev => {
            const existingIds = new Set(prev.exercises.map(e => e.exerciseId));

            const formatted = newExercises
                .filter(e => !existingIds.has(e.id))
                .map(e => ({
                    id: crypto.randomUUID(),
                    exerciseId: e.id,
                    name: e.name,
                    sets: [
                        {
                            id: crypto.randomUUID(),
                            reps: 0,
                        },
                    ],
                }));

            return {
                ...prev,
                exercises: [...prev.exercises, ...formatted],
            };
        });
    };

    // Update sets
    const updateExerciseSets = (exerciseId: string, newSets: RoutineSet[]) => {
        setRoutine(prev => ({
            ...prev,
            exercises: prev.exercises.map(ex =>
                ex.id === exerciseId
                    ? { ...ex, sets: newSets }
                    : ex
            ),
        }));
    };

    // Delete exercise
    const deleteExercise = (exerciseId: string) => {
        setRoutine(prev => ({
            ...prev,
            exercises: prev.exercises.filter(ex => ex.id !== exerciseId),
        }));
    };

    // Reset
    const resetRoutine = () => {
        setRoutine({
            title: "",
            exercises: [],
        });
    };

    const loadRoutineFromWorkout = (exercises: RoutineExercise[], title?: string) => {
        const builtExercises: RoutineExercise[] = exercises.map((ex) => ({
            id: crypto.randomUUID(),
            exerciseId: ex.exerciseId,
            name: ex.name,
            sets: ex.sets.map((set) => ({
                id: crypto.randomUUID(),
                reps: set.reps,
            })),
        }));

        setRoutine({
            title: title ?? "",
            exercises: builtExercises,
        });
    };

    return (
        <RoutineContext.Provider
            value={{
                routine,
                setTitle,
                setExercises,
                addExercises,
                updateExerciseSets,
                deleteExercise,
                resetRoutine,
                loadRoutineFromWorkout,
            }}
        >
            {children}
        </RoutineContext.Provider>
    );
};

export const useRoutine = () => {
    const context = useContext(RoutineContext);
    if (!context) {
        throw new Error("useRoutine must be used within RoutineProvider");
    }
    return context;
};