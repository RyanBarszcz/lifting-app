"use client";

import { MoreVertical } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { RoutineExercise, RoutineSet } from "@/types";

// interface RoutineSet {
//     id: string;
//     reps: number;
// }

// interface Exercise {
//     id: string;
//     title: string;
//     sets: RoutineSet[];
// }

export default function RoutineExerciseCard({
    exercise,
    onDeleteExercise,
    onUpdateSets,
}: {
    exercise: RoutineExercise;
    onDeleteExercise: (exerciseId: string) => void;
    onUpdateSets: (exerciseId: string, sets: RoutineSet[]) => void;
}) {
    const router = useRouter();
    const [confirmDeleteSetId, setConfirmDeleteSetId] = useState<string | null>(null);
    const [showExerciseMenu, setShowExerciseMenu] = useState(false);

    // HELPER FUNCTIONS ------------------------
    const addSet = () => {
        const newSet: RoutineSet = {
            id: crypto.randomUUID(),
            reps: 0,
        };

        onUpdateSets(exercise.id, [...exercise.sets, newSet]);
    };

    const deleteSet = (id: string) => {
        const updated = exercise.sets.filter((s) => s.id !== id);
        onUpdateSets(exercise.id, updated);
        setConfirmDeleteSetId(null);
    };

    const updateReps = (id: string, reps: number) => {
        const updated = exercise.sets.map((s) =>
            s.id === id ? { ...s, reps } : s
        );

        onUpdateSets(exercise.id, updated);
    };
    // ----------------------------------------------


    return (
        <div className="bg-[#1a1a1a] border border-[#262626] rounded-2xl p-5 space-y-4 relative">

            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-blue-500 text-lg font-semibold">
                    {exercise.title}
                </h2>

                <button
                    onClick={() => setShowExerciseMenu((prev) => !prev)}
                    className="p-1 rounded-full hover:bg-[#262626]"
                >
                    <MoreVertical size={18} />
                </button>
            </div>

            {/* Exercise Menu */}
            {showExerciseMenu && (
                <div className="absolute right-4 top-14 z-30 bg-[#1a1a1a] border border-[#262626] rounded-lg shadow-xl p-2 w-40">
                    <button
                        onClick={() => {
                            setShowExerciseMenu(false);
                            onDeleteExercise(exercise.id);
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-[#262626] rounded text-red-500"
                    >
                        Delete Exercise
                    </button>

                    <button
                        onClick={() => {
                            setShowExerciseMenu(false);
                            router.push("/workout/reorder");
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-[#262626] rounded"
                    >
                        Reorder Exercises
                    </button>
                </div>
            )}

            {/* Column Labels */}
            <div className="grid grid-cols-3 text-xs text-gray-400 px-2">
                <span className="text-left">SET</span>
                <span className="text-center">REPS</span>
            </div>

            {/* Sets */}
            <div className="space-y-1">
                {exercise.sets.map((set, index) => {
                    const isEven = index % 2 === 0;

                    return (
                        <div key={set.id} className="relative">
                            <div
                                className={`grid grid-cols-3 px-2 py-2 rounded-lg ${isEven ? "bg-black" : "bg-[#121212]"
                                    }`}
                            >
                                {/* Set Number (click to delete) */}
                                <button
                                    onClick={() => setConfirmDeleteSetId(set.id)}
                                    className="text-sm hover:text-red-400 text-left"
                                >
                                    {index + 1}
                                </button>

                                {/* Reps */}
                                <input
                                    type="number"
                                    min="0"
                                    value={set.reps}
                                    onChange={(e) =>
                                        updateReps(set.id, Number(e.target.value))
                                    }
                                    className="bg-transparent outline-none text-sm text-center"
                                />
                            </div>

                            {/* Delete Popup */}
                            {confirmDeleteSetId === set.id && (
                                <div className="absolute left-2 top-full mt-2 z-20 bg-[#1a1a1a] border border-[#262626] rounded-lg p-3 shadow-xl">
                                    <p className="text-sm mb-2">Delete Set?</p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => deleteSet(set.id)}
                                            className="text-xs bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={() => setConfirmDeleteSetId(null)}
                                            className="text-xs bg-[#262626] px-3 py-1 rounded"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Add Set */}
            <button
                onClick={addSet}
                className="w-full py-2 rounded-lg bg-[#262626] hover:bg-[#2e2e2e] text-sm transition"
            >
                + Add Set
            </button>
        </div>
    );
}