"use client";

import { useRouter } from "next/navigation";
import RoutineExerciseCard from "@/components/RoutineExerciseCard";
import { useRoutine } from "@/context/RoutineContext";
import { getToken, useAuth } from "@clerk/nextjs";
import { log } from "console";

export default function CreateRoutinePage() {
    const router = useRouter();
    const { getToken } = useAuth();

    const {
        routine,
        setTitle,
        updateExerciseSets,
        deleteExercise,
        resetRoutine,
    } = useRoutine();

    // TODO: Add toast for why it didn't save or it did save
    const handleSaveRoutine = async () => {
        try {
            // Validation
            if (!routine.title.trim()) {
                alert("Please enter a routine title");
                return;
            }

            if (routine.exercises.length === 0) {
                alert("Add at least one exercise");
                return;
            }

            // Format payload
            const payload = {
                title: routine.title,
                exercises: routine.exercises.map((ex, index) => ({
                    exerciseId: ex.exerciseId,
                    orderIndex: index + 1,
                    sets: ex.sets.map((set, i) => ({
                        setNumber: i + 1,
                        reps: set.reps,
                    })),
                })),
            };

            // Auth
            const token = await getToken();

            // API call
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/templates/create`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to save routine");
            }

            // Success
            resetRoutine();
            router.push("/workout");
            console.log("Routine saved:", payload);
        } catch (err) {
            console.error(err);
            alert("Failed to save routine");
        }
    };

    return (
        <div className="min-h-screen bg-black text-white px-4 py-4">

            {/* Top Bar */}
            <div className="flex items-center justify-between mb-6">
                <button onClick={() => {
                    router.push("/workout/");
                    resetRoutine();
                }
                }>
                    Cancel
                </button>

                <h1 className="font-semibold">Create Routine</h1>

                <button
                    onClick={handleSaveRoutine}
                    className="bg-blue-500 rounded-lg py-2 px-4 text-white font-semibold">
                    Save
                </button>
            </div>

            {/* Title Input */}
            <input
                value={routine.title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Routine Title"
                className="w-full bg-transparent border-b border-[#262626] py-3 text-lg outline-none mb-6"
            />

            {/* Exercises Section */}
            <div className="space-y-3">

                {routine.exercises.map((exercise) => (
                    <RoutineExerciseCard
                        key={exercise.id}
                        exercise={exercise}
                        onUpdateSets={updateExerciseSets}
                        onDeleteExercise={deleteExercise}
                    />
                ))}

                {/* Add Exercise Button */}
                <button
                    onClick={() => router.push("/workout/routines/add-exercise")}
                    className="w-full bg-[#1a1a1a] border border-[#262626] py-3 rounded-xl text-center"
                >
                    + Add Exercise
                </button>

            </div>
        </div>
    );
}