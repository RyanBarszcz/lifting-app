"use client";

import { Award, MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { WorkoutDetail, WorkoutExercise, WorkoutSummary } from '@/types';
import { useState } from 'react';
import { useWorkout } from '@/context/WorkoutContext';
import { useAuth } from '@clerk/nextjs';

// interface Workout {
//     id: string;
//     title: string;
//     completedAt: string;
//     duration: string;
//     records: number;
//     totalVolume: number;
//     exercises: {
//         name: string;
//         sets: number;
//     }[];
// }

export default function WorkoutCard({ workout }: { workout: WorkoutSummary }) {
    const router = useRouter();
    const [showMenu, setShowMenu] = useState(false);
    const { startWorkoutWithExercises } = useWorkout();
    const { getToken } = useAuth();

    const visibleExercises = workout.exercises.slice(0, 3);
    const remaining = workout.exercises.length - 3;

    const handleCopyWorkout = async () => {
        try {
            const token = await getToken();

            // Fetch FULL workout (not summary)
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/workout/${workout.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const fullWorkout: WorkoutDetail = await res.json();
            console.log("Full: ", fullWorkout);

            // Build exercises with REAL sets
            const exercises: WorkoutExercise[] = fullWorkout.exercises.map((ex) => ({
                id: crypto.randomUUID(), // UI id
                exerciseId: ex.exerciseId,
                name: ex.name,
                sets: ex.sets.map((set) => ({
                    id: crypto.randomUUID(),
                    setNumber: set.setNumber,
                    reps: set.reps,
                    weight: set.weight,
                    completed: false, // UI-only
                })),
            }));

            // Start workout (session auto-created in context)
            await startWorkoutWithExercises(null, exercises);

            router.push("/workout/active");

        } catch (err) {
            console.error(err);
            alert("Failed to copy workout");
        }
    };


    return (
        <div
            onClick={() => router.push(`/workout/${workout.id}`)}
            className="bg-[#1a1a1a] border border-[#262626] rounded-2xl p-5 space-y-4 mb-6">

            {/* Title + Date */}
            <div>
                <div className="flex items-start justify-between">

                    {workout.title && (
                        <h2 className="text-xl font-semibold">{workout.title}</h2>
                    )}


                    {/* TODO: Make it open options for workout */}
                    {/* Save as Routine, Copy Workout, Delete Workout */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowMenu((prev) => !prev);
                        }}
                        className="text-white hover:text-white transition-colors">
                        <MoreHorizontal size={20} />
                    </button>
                    {showMenu && (
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-5 mt-2 bg-[#1a1a1a] border border-[#262626] rounded-lg shadow-lg z-20 w-48"
                        >
                            <button
                                onClick={() => handleCopyWorkout()}
                                className="w-full text-left px-4 py-2 hover:bg-[#262626]"
                            >
                                Copy Workout
                            </button>

                            <button
                                onClick={() => console.log("Save as routine")}
                                className="w-full text-left px-4 py-2 hover:bg-[#262626]"
                            >
                                Save as Routine
                            </button>

                            <button
                                onClick={() => console.log("Delete workout")}
                                className="w-full text-left px-4 py-2 hover:bg-[#262626] text-red-500"
                            >
                                Delete Workout
                            </button>
                        </div>
                    )}
                </div>

                <p className="text-sm text-gray-500 mt-1">{workout.completedAt}</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 text-md">

                <div className="flex flex-col">
                    <span className="text-gray-500 text-xs tracking-wide">
                        Duration
                    </span>
                    <span className="text-gray-300 font-medium">
                        {workout.duration}
                    </span>
                </div>

                <div className="flex flex-col">
                    <span className="text-gray-500 text-xs tracking-wide">
                        Volume
                    </span>
                    <span className="text-gray-300 font-medium">
                        {workout.totalVolume}
                    </span>
                </div>

                <div className="flex flex-col">
                    <span className="text-gray-500 text-xs tracking-wide">
                        Records
                    </span>
                    <div className="flex items-center gap-1">
                        <Award size={16} className="text-yellow-400" />
                        <span className="text-white font-medium">
                            {workout.records}
                        </span>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className='border-t border-gray-600' />

            {/* Exercise Preview */}
            <div className="space-y-1 text-md text-gray-300">
                {visibleExercises.map((exercise, index) => (
                    <div key={index}>
                        {exercise.sets} sets {exercise.name}
                    </div>
                ))}

                {remaining > 0 && (
                    <div className="text-gray-500">
                        See {remaining} more exercises
                    </div>
                )}
            </div>
        </div>
    );
}
