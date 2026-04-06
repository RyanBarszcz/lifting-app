"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import ExerciseHistoryCard from "@/components/ExerciseHistoryCard";

export default function WorkoutDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const { getToken } = useAuth();

    const [workout, setWorkout] = useState<any>(null);
    const [showOptionsModal, setShowOptionsModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showToast, setShowToast] = useState(false);

    // Get workout
    useEffect(() => {
        const fetchWorkout = async () => {
            const token = await getToken();
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/workout/${id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    }
                },

            );
            const data = await res.json();
            console.log(`Id workout: ${id}`);
            console.log("Data: ", data);
            setWorkout(data);
        };

        fetchWorkout();
    }, [id]);

    const deleteWorkout = async () => {
        try {
            const token = await getToken();

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/sessions/${id}/delete`,
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

            // Notification
            setShowDeleteConfirm(false);
            setShowToast(true);

            setTimeout(() => {
                router.push("/workout");
            }, 1200);

        } catch (err) {
            console.error(err);
            alert("Failed to delete workout");
        }
    };

    if (!workout) return null;

    return (
        <div className="min-h-screen bg-black text-white px-6 py-6">

            {/* Top Bar */}
            <div className="flex justify-between items-center mb-6">
                <button onClick={() => router.back()}>
                    <ArrowLeft size={22} />
                </button>

                <h1 className="text-lg font-semibold">Workout Details</h1>

                <div className="relative">
                    <button
                        onClick={() => setShowOptionsModal(prev => !prev)}
                        className="p-1 rounded-full hover:bg-[#262626]"
                    >
                        <MoreVertical size={20} />
                    </button>
                </div>
            </div>

            {/* Title & Date */}
            <h2 className="text-2xl font-bold mb-1">
                <span className="text-2xl"> {workout.title}</span>
            </h2>

            {/* Date */}
            <h3 className="text-md mb-6 text-blue-400">
                {workout.formattedDate}
            </h3>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-x-2 mb-6">
                <div>
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="font-semibold">{workout.duration} min</p>
                </div>

                <div>
                    <p className="text-xs text-gray-500">Volume</p>
                    <p className="font-semibold">{workout.volume} lbs</p>
                </div>

                <div>
                    <p className="text-xs text-gray-500">Sets</p>
                    <p className="font-semibold">{workout.totalSets}</p>
                </div>
            </div>

            {/* Muscle Split */}
            <div className="mb-6">
                <h3 className="text-sm text-gray-400 mb-2">Muscle Split</h3>

                {workout.muscleSplit.map((m: any) => (
                    <div key={m.muscle} className="flex justify-between mb-1">
                        <span>{m.muscle}</span>
                        <span className="text-gray-400">{m.percent}%</span>
                    </div>
                ))}
            </div>

            {/* Exercises */}
            <div className="space-y-4">
                {workout.exercises.map((exercise: any) => (
                    <ExerciseHistoryCard
                        key={exercise.id}
                        exercise={exercise}
                    />
                ))}
            </div>

            {showOptionsModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-[#1a1a1a] border border-[#262626] rounded-2xl p-6 w-80 text-center space-y-4">

                        <h2 className="text-lg font-semibold">
                            Workout Options
                        </h2>

                        <button
                            onClick={() => {
                                setShowOptionsModal(false);
                                setShowDeleteConfirm(true);
                            }}
                            className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg"
                        >
                            Delete Workout
                        </button>

                        <button
                            onClick={() => setShowOptionsModal(false)}
                            className="w-full bg-[#262626] py-2 rounded-lg"
                        >
                            Cancel
                        </button>

                    </div>
                </div>
            )}

            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-[#1a1a1a] border border-[#262626] rounded-2xl p-6 w-80 text-center space-y-4">

                        <h2 className="text-lg font-semibold">
                            Delete Workout?
                        </h2>

                        <p className="text-sm text-gray-400">
                            This will permanently delete this workout and all sets.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 bg-[#262626] py-2 rounded-lg"
                            >
                                No
                            </button>

                            <button
                                onClick={deleteWorkout}
                                className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-lg"
                            >
                                Yes
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {showToast && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg z-50 animate-fade-in">
                    Workout deleted successfully
                </div>
            )}
        </div>


    );
}
