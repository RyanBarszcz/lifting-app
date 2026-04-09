"use client";

import { useRouter } from "next/navigation";
import RoutineExerciseCard from "@/components/RoutineExerciseCard";
import { useRoutine } from "@/context/RoutineContext";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { saveRoutine } from "@/lib/services/routineService";
import { useState } from "react";

export default function CreateRoutinePage() {
    const router = useRouter();
    const { getToken, isLoaded } = useAuth();
    const [saving, setSaving] = useState(false);

    const {
        routine,
        setTitle,
        updateExerciseSets,
        deleteExercise,
        resetRoutine,
    } = useRoutine();

    // TODO: Possibly add a loading spinner on the save button
    const handleSaveRoutine = async () => {
        if (!isLoaded) return;
        if (saving) return; // prevent double click
        try {
            if (!routine.title.trim()) {
                toast.error("Please enter a routine title");
                return;
            }

            if (routine.exercises.length === 0) {
                toast.error("Add at least one exercise");
                return;
            }

            setSaving(true);

            const token = await getToken();
            if (!token) return;

            await saveRoutine(token, routine);

            resetRoutine();
            router.push("/workout");

            toast.success("Routine saved!", {
                description: "Ready to use in your workouts",
            });

        } catch (err) {
            console.error(err);
            toast.error("Failed to save routine");
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
                    disabled={saving}
                    onClick={handleSaveRoutine}
                    className={`rounded-lg py-2 px-4 text-white font-semibold ${saving ? "bg-gray-500" : "bg-blue-500"
                        }`}
                >
                    {saving ? "Saving..." : "Save"}
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