"use client";

import { Award, MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { RoutineExercise, WorkoutDetail, WorkoutExercise, WorkoutSummary } from '@/types';
import { useState, useEffect, useRef } from 'react';
import { useWorkout } from '@/context/WorkoutContext';
import { useAuth } from '@clerk/nextjs';
import { useRoutine } from '@/context/RoutineContext';
import { handleError } from '@/lib/utils/handleError';
import { toast } from 'sonner';


export default function WorkoutCard({ workout }: { workout: WorkoutSummary }) {
    const router = useRouter();
    const [showMenu, setShowMenu] = useState(false);
    const { startWorkoutWithExercises } = useWorkout();
    const { getToken } = useAuth();
    const { loadRoutineFromWorkout } = useRoutine();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const totalSets = workout.exercises.reduce(
        (acc, ex) => acc + ex.sets,
        0
    );

    const visibleExercises = workout.exercises.slice(0, 3);
    const remaining = workout.exercises.length - 3;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setShowMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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
            // console.log("Full: ", fullWorkout);

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
            toast.error(handleError(err));
        }
    };

    const handleMakeRoutine = async () => {
        try {
            const token = await getToken();

            // fetch full workout
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/workout/${workout.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) {
                throw new Error("Failed to fetch workout");
            }

            const fullWorkout: WorkoutDetail = await res.json();
            // console.log("Full Workout: ", fullWorkout);

            //convert to routine format
            const exercises: RoutineExercise[] = fullWorkout.exercises.map((ex) => ({
                id: crypto.randomUUID(),
                exerciseId: ex.exerciseId,
                title: ex.name,
                sets: ex.sets.map((set) => ({
                    id: crypto.randomUUID(),
                    reps: set.reps,
                })),
            }));

            // console.log("Converted: ", exercises);

            // Load into routine context
            loadRoutineFromWorkout(exercises, fullWorkout.title);

            // Close menu
            setShowMenu(false);

            // Navigate
            router.push("/workout/routines/create");

        } catch (err) {
            toast.error(handleError(err));
        }
    };

    const handleDeleteWorkout = async () => {
        setShowMenu(false);
        setShowDeleteModal(true);
    }

    const confirmDeleteWorkout = async () => {
        try {
            const token = await getToken();

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/workout/${workout.id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) {
                throw new Error("Failed to delete workout");
            }

            setShowDeleteModal(false);

            // quick refresh (fine for now)
            window.location.reload();

        } catch (err) {
            toast.error(handleError(err));
        }
    };

    return (
        <div
            onClick={() => router.push(`/workout/${workout.id}`)}
            className="relative bg-[#1a1a1a] border border-[#262626] rounded-2xl p-5 space-y-4 mb-6">

            {/* Title + Date */}
            <div>
                <div className="flex items-start justify-between">

                    {workout.title && (
                        <h2 className="text-xl font-semibold">{workout.title}</h2>
                    )}

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
                            ref={menuRef}
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
                                onClick={() => handleMakeRoutine()}
                                className="w-full text-left px-4 py-2 hover:bg-[#262626]"
                            >
                                Save as Routine
                            </button>

                            <button
                                onClick={() => handleDeleteWorkout()}
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
                        {workout.totalVolume} lbs
                    </span>
                </div>

                <div className="flex flex-col">
                    <span className="text-gray-500 text-xs tracking-wide">
                        {/* Awards */}
                        Sets
                    </span>
                    <div className="flex items-center gap-1">
                        {/* <Award size={16} className="text-yellow-400" /> */}
                        <span className="text-white font-medium">
                            {/* {workout.records} */}
                            {totalSets}
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
                        {exercise.sets} {exercise.sets === 1 ? "set" : "sets"} {exercise.name}
                    </div>
                ))}

                {remaining > 0 && (
                    <div className="text-gray-500">
                        See {remaining} more exercises
                    </div>
                )}
            </div>
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-[#1a1a1a] border border-[#262626] rounded-2xl p-6 w-80 text-center space-y-4">
                        <h2 className="text-lg font-semibold">
                            Delete Workout?
                        </h2>

                        <p className="text-sm text-gray-400">
                            This cannot be undone.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 bg-[#262626] py-2 rounded-lg"
                            >
                                No
                            </button>

                            <button
                                onClick={confirmDeleteWorkout}
                                className="flex-1 bg-red-500 py-2 rounded-lg"
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
