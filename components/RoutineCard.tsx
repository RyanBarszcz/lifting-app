"use client";

import { useRouter } from "next/navigation";
import { MoreHorizontal } from "lucide-react";
import { useWorkout } from "@/context/WorkoutContext";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Routine } from "@/types";
import { handleError } from "@/lib/utils/handleError";
import { toast } from "sonner";


export default function RoutineCard({ routine, onDelete }: { routine: Routine; onDelete: (id: string) => void; }) {
    const router = useRouter();
    const { startWorkoutWithExercises } = useWorkout();
    const { getToken } = useAuth();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // useEffect(() => {
    //     console.log("Routine: ", routine);
    // }, []);

    const handleStartRoutine = async () => {
        try {
            const token = await getToken();

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/sessions/start`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        templateId: routine.id,
                    })
                }
            );

            if (!res.ok) {
                throw new Error("Failed to start session");
            }

            const session = await res.json();

            // console.log("Exercises we start with:", session);
            // console.log("Routine things to start: ", routine);

            startWorkoutWithExercises(
                session.id,
                routine.exercises.map(e => ({
                    exerciseId: e.exerciseId,
                    name: e.name,
                    sets: e.sets.map((set, i) => ({
                        setNumber: i + 1,
                        reps: set.reps,
                    })),
                }))
            );

            router.push("/workout/active");

        } catch (err) {
            toast.error(handleError(err));
        }
    };

    return (
        <div className="bg-[#1a1a1a] border border-[#262626] rounded-2xl p-5 space-y-2">

            {/* Title + Menu */}
            <div className="flex items-start justify-between">
                <h2 className="text-xl font-semibold">{routine.title}</h2>

                <button
                    onClick={() => setShowDeleteModal(true)}
                    className="p-1 -mr-1 rounded-full text-white hover:text-white hover:bg-[#262626] transition-colors">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            {/* Exercise Preview (2-line clamp) */}
            <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">
                {routine.exercises.map(e => e.name).join(", ")}
            </p>

            {/* Start Button */}
            <button
                onClick={handleStartRoutine}
                className="w-full bg-blue-500 text-white py-2.5 rounded-xl font-medium mt-2"
            >
                Start Routine
            </button>

            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-[#1a1a1a] border border-[#262626] rounded-2xl p-6 w-80 text-center space-y-4">
                        <h2 className="text-lg font-semibold">
                            Delete Routine?
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
                                onClick={() => {
                                    onDelete(routine.id);
                                    setShowDeleteModal(false);
                                }}
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
