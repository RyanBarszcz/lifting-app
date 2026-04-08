"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { useWorkout } from "@/context/WorkoutContext";
import { useAuth } from "@clerk/nextjs";

export default function SaveWorkoutPage() {
    const router = useRouter();
    const params = useSearchParams();
    const { workout, resetWorkout, updateWorkoutMeta } = useWorkout();
    const { getToken } = useAuth();
    const sessionId = params.get("sessionId");
    const title = workout.title;
    const notes = workout.notes;

    useEffect(() => {
        // console.log("Workout: ", workout);
    }, []);

    // Stats
    const totalStats = workout.exercises.reduce(
        (acc, exercise) => {
            exercise.sets.forEach((set) => {
                if (set.completed) {
                    acc.completedSets += 1;
                    acc.volume += (set.weight ?? 0) * set.reps;
                }
            });
            return acc;
        },
        { completedSets: 0, volume: 0 }
    );

    const duration = workout.startedAt
        ? Math.floor((Date.now() - workout.startedAt) / 1000)
        : 0;

    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;

        const hourLabel = hours === 1 ? "hr" : "hrs";

        if (hours > 0) {
            return `${hours}${hourLabel} ${mins}m ${secs}s`;
        }

        return `${mins}m ${secs}s`;
    };

    const handleSave = async () => {

        try {
            const token = await getToken();

            const cleanedExercises = workout.exercises
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

            if (cleanedExercises.length === 0) {
                alert("Complete at least one set before saving.");
                return;
            }

            await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/sessions/${sessionId}/complete`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        exercises: cleanedExercises,
                        endNote: notes.trim() || null,
                        title: title.trim() || "Workout",
                    }),
                }
            );

            // console.log("Workout sent: ", workout);

            router.push("/workout");
            resetWorkout();


        } catch (err) {
            console.error(err);
            alert("Failed to save workout");
        }
    };

    return (
        <div className="w-full min-h-screen bg-black text-white flex flex-col">

            {/* HEADER */}
            <div className="sticky top-0 bg-[#1a1a1a] px-4 py-3 flex items-center justify-between border-b border-[#262626]">

                {/* TODO: When clicking back it should have the state of the workout from before. */}
                {/* Should possibly save completed or not for sets */}
                <button onClick={() => {
                    // console.log("Saved Workout info: ", workout);
                    router.back()
                }}>
                    <ChevronLeft />
                </button>

                <h1 className="font-semibold">Save Workout</h1>

                <button
                    onClick={handleSave}
                    className="bg-blue-500 px-4 py-2 rounded-lg font-medium"
                >
                    Save
                </button>
            </div>

            {/* CONTENT */}
            <div className="px-6 py-6 space-y-6">

                {/* TITLE */}
                <div>
                    <p className="text-sm text-gray-400 mb-1">Workout Title</p>
                    <input
                        value={title}
                        onChange={(e) => updateWorkoutMeta({ title: e.target.value })}
                        className="w-full bg-[#1a1a1a] rounded-xl px-4 py-3 outline-none"
                    />
                </div>

                {/* STATS */}
                <div className="grid grid-cols-3 text-center bg-[#1a1a1a] rounded-xl py-4">
                    <div>
                        <p className="text-xs text-gray-500">Duration</p>
                        <p className="text-blue-500 mt-1">
                            {formatTime(duration)}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500">Volume</p>
                        <p className="mt-1">{totalStats.volume} lbs</p>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500">Sets</p>
                        <p className="mt-1">{totalStats.completedSets}</p>
                    </div>
                </div>

                {/* DATE */}
                <div>
                    <p className="text-sm text-gray-400 mb-1">Date</p>
                    <p className="bg-[#1a1a1a] rounded-xl px-4 py-3">
                        {new Date().toLocaleDateString()}
                    </p>
                </div>

                {/* NOTES */}
                <div>
                    <p className="text-sm text-gray-400 mb-1">Description</p>
                    <textarea
                        value={notes}
                        onChange={(e) => updateWorkoutMeta({ notes: e.target.value })}
                        className="w-full bg-[#1a1a1a] rounded-xl px-4 py-3 outline-none min-h-[120px]"
                        placeholder="How did it feel?"
                    />
                </div>
            </div>
        </div>
    );
}