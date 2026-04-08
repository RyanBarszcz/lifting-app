"use client";

import { ChevronDown, Dumbbell } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWorkout } from "@/context/WorkoutContext";
import ExerciseCard from "@/components/ExerciseCard";
import { useAuth } from "@clerk/nextjs";
import { PreviousSet, WorkoutSet } from "@/types";


// Local Type
interface UIExercise {
    id: string;
    exerciseId: string;
    name: string;
    sets: WorkoutSet[];
}

export default function ActiveWorkoutPage() {
    const router = useRouter();
    const { workout, resetWorkout, deleteExercise, updateWorkoutExercises } = useWorkout();
    const workoutExercises = workout.exercises;
    const { getToken } = useAuth();

    const [seconds, setSeconds] = useState(0);
    const [exercises, setExercises] = useState<UIExercise[]>([]);
    const [previousMap, setPreviousMap] = useState<Record<string, PreviousSet[]>>({});
    const [showFinishModal, setShowFinishModal] = useState(false);

    const totalStats = exercises.reduce(
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

    const hasIncompleteSets = exercises.some(exercise =>
        exercise.sets.some(set => !set.completed)
    );

    const updateExerciseSets = (exerciseId: string, newSets: UIExercise["sets"]) => {
        setExercises(prev => {
            const updated = prev.map(ex =>
                ex.id === exerciseId
                    ? { ...ex, sets: newSets }
                    : ex
            );

            // sync to context
            updateWorkoutExercises(
                updated.map(ex => ({
                    id: ex.id,
                    exerciseId: ex.exerciseId,
                    name: ex.name,
                    sets: ex.sets.map(s => ({
                        setNumber: s.setNumber,
                        reps: s.reps,
                        weight: s.weight,
                        completed: s.completed,
                    })),
                }))
            );
            return updated;
        });
    };

    // Initialize exercises from context
    useEffect(() => {
        if (!workoutExercises || workoutExercises.length === 0) {
            setExercises([]);
            return;
        }

        // console.log("Workout Exercises: ", workoutExercises);

        const formatted: UIExercise[] = workoutExercises.map((e) => ({
            id: e.id,
            exerciseId: e.exerciseId,
            name: e.name,
            sets: e.sets.map((set) => ({
                id: crypto.randomUUID(),
                weight: set.weight ?? 0,
                reps: set.reps,
                completed: set.completed,
                setNumber: set.setNumber,
            })),
        }));

        // console.log("For the workout: ", formatted);


        setExercises(formatted);
    }, [workoutExercises]);

    // Fetch previous sets
    useEffect(() => {
        if (exercises.length === 0) return;

        const fetchPrevious = async () => {
            const token = await getToken();
            const ids = exercises.map(e => e.exerciseId).join(",");

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/workout/previous?exerciseIds=${ids}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();
            setPreviousMap(data);
        };

        fetchPrevious();
    }, [exercises]);

    // Live timer
    useEffect(() => {
        if (!workout.startedAt) return;

        const interval = setInterval(() => {
            const diff = Math.floor((Date.now() - workout.startedAt!) / 1000);
            setSeconds(diff);
        }, 1000);

        return () => clearInterval(interval);
    }, [workout.startedAt]);

    const formatTime = (totalSeconds: number) => {
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;

        if (hrs > 0) {
            return `${hrs}:${mins.toString().padStart(2, "0")}:${secs
                .toString()
                .padStart(2, "0")}`;
        }

        return `${mins}min ${secs}s`;
    };

    const handleDiscardWorkout = async () => {
        try {
            const token = await getToken();

            if (workout.sessionId) {
                await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/sessions/${workout.sessionId}/delete`,
                    {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            }

            resetWorkout();
            router.push("/workout");

        } catch (err) {
            console.error(err);
            alert("Failed to discard workout");
        }
    };

    return (
        <div className="w-full text-white">

            {/* Header */}
            <div className="sticky top-0 z-30">
                <div className="bg-[#1a1a1a] px-4 pt-2 pb-2 flex items-center justify-between border-b-2 border-[#262626]">
                    <div className="flex gap-x-2">
                        <button
                            onClick={() => router.back()}
                            className="text-gray-400 hover:text-white"
                        >
                            <ChevronDown size={22} />
                        </button>
                        <h1 className="text-lg font-semibold">Log Workout</h1>
                    </div>
                    <button
                        onClick={() => {
                            if (hasIncompleteSets) {
                                setShowFinishModal(true);
                            } else {
                                router.push(`/workout/save?sessionId=${workout.sessionId}`);
                                // console.log("Workout before save page: ", workout);
                            }
                        }}
                        className="bg-blue-500 rounded-lg py-2 px-4 text-white font-semibold">
                        Finish
                    </button>
                </div>

                <div className="bg-black border-t border-[#262626] border-b border-[#262626] px-4 py-4 grid grid-cols-3 text-center">
                    <div>
                        <p className="text-xs text-gray-500">Duration</p>
                        <p className="text-blue-500 mt-1">
                            {formatTime(seconds)}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500">Volume</p>
                        <p className="font-semibold mt-1">
                            {totalStats.volume} lbs
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500">Sets</p>
                        <p className="font-semibold mt-1">
                            {totalStats.completedSets}
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-6 py-12 pb-32 text-center space-y-6">
                {exercises.length === 0 ? (
                    <div className="flex flex-col items-center space-y-2">
                        <Dumbbell size={48} className="text-gray-600 mb-4" />
                        <h2 className="text-lg font-semibold">Get Started</h2>
                        <p className="text-gray-500 text-sm">
                            Add an exercise to start your workout
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4 w-full">
                        {exercises.map((exercise) => (
                            <ExerciseCard
                                key={exercise.id}
                                exercise={exercise}
                                previousSets={previousMap[exercise.exerciseId] || []}
                                onDeleteExercise={deleteExercise}
                                onUpdateSets={updateExerciseSets}
                            />
                        ))}
                    </div>
                )}

                <button
                    onClick={() => router.push("/workout/add-exercise")}
                    className="w-full bg-blue-500 text-white py-3 rounded-xl font-medium"
                >
                    + Add Exercise
                </button>

                <button
                    onClick={handleDiscardWorkout}
                    className="w-full bg-[#1a1a1a] border border-[#262626] text-red-400 py-3 rounded-xl font-medium"
                >
                    Discard Workout
                </button>
            </div>

            {/* Finish Modal */}
            {showFinishModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-[#1a1a1a] border border-[#262626] rounded-2xl p-6 w-80 text-center space-y-4">
                        <h2 className="text-lg font-semibold">
                            Incomplete Sets Detected
                        </h2>

                        <p className="text-sm text-gray-400">
                            You have unfinished sets. Finishing will remove them.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowFinishModal(false)}
                                className="flex-1 bg-[#262626] py-2 rounded-lg"
                            >
                                Go Back
                            </button>

                            <button
                                onClick={() => {
                                    setShowFinishModal(false);
                                    router.push(`/workout/save?sessionId=${workout.sessionId}`);
                                }}
                                className="flex-1 bg-blue-500 py-2 rounded-lg"
                            >
                                Finish Anyway
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}