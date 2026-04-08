"use client";

import { MoreVertical, Check } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { WorkoutExercise, WorkoutSet, PreviousSet } from "@/types";


export default function ExerciseCard({
    exercise,
    previousSets,
    onDeleteExercise,
    onUpdateSets,
}: {
    exercise: WorkoutExercise;
    previousSets: PreviousSet[];
    onDeleteExercise: (exerciseId: string) => void;
    onUpdateSets: (exerciseId: string, sets: WorkoutSet[]) => void;
}) {
    const router = useRouter();
    const [confirmDeleteSetId, setConfirmDeleteSetId] = useState<number | null>(null);
    const [showExerciseMenu, setShowExerciseMenu] = useState(false);

    const toggleComplete = (id: number) => {
        const updated = exercise.sets.map((set) =>
            set.setNumber === id ? { ...set, completed: !set.completed } : set
        );
        onUpdateSets(exercise.id, updated);
    };

    const addWorkoutSet = () => {
        const newSetNumber = exercise.sets.length + 1;

        const newWorkoutSet: WorkoutSet = {
            setNumber: newSetNumber,
            weight: 0,
            reps: 0,
            completed: false,
        };

        onUpdateSets(exercise.id, [...exercise.sets, newWorkoutSet]);
    };

    const deleteSet = (id: number) => {
        const updated = exercise.sets.filter((s) => s.setNumber !== id);
        onUpdateSets(exercise.id, updated);
        setConfirmDeleteSetId(null);
    };

    const updateWeight = (id: number, weight: number) => {
        const updated = exercise.sets.map((s) =>
            s.setNumber === id ? { ...s, weight } : s
        );
        onUpdateSets(exercise.id, updated);
    };

    const updateReps = (id: number, reps: number) => {
        const updated = exercise.sets.map((s) =>
            s.setNumber === id ? { ...s, reps } : s
        );
        onUpdateSets(exercise.id, updated);
    };

    return (
        <div className="bg-[#1a1a1a] border border-[#262626] rounded-2xl p-5 space-y-4 relative">

            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-blue-500 text-lg font-semibold">
                    {exercise.name}
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
            <div className="grid grid-cols-5 items-center justify-items-center text-xs text-gray-400 px-2">
                <span>SET</span>
                <span>PREVIOUS</span>
                <span>LBS</span>
                <span>REPS</span>
                <span><Check size={18} /></span>
            </div>

            {/* Sets */}
            <div className="space-y-1">
                {exercise.sets.map((set, index) => {
                    const isEven = index % 2 === 0;
                    const previous = previousSets.find(
                        (p) => p.setNumber === index + 1
                    );

                    const rowBg = set.completed
                        ? "bg-green-700"
                        : isEven
                            ? "bg-black"
                            : "bg-[#121212]";

                    return (
                        <div key={set.setNumber} className="relative">
                            <div
                                className={`grid grid-cols-5 items-center px-2 py-2 rounded-lg transition ${rowBg}`}
                            >
                                <button
                                    onClick={() => setConfirmDeleteSetId(set.setNumber)}
                                    className="text-sm hover:text-red-400 transition"
                                >
                                    {index + 1}
                                </button>

                                <span className={`text-sm ${set.completed ? "text-white" : "text-gray-400"}`}>
                                    {previous
                                        ? `${previous.weight}lbs x ${previous.reps}`
                                        : "-"}
                                </span>

                                <input
                                    type="number"
                                    value={set.weight ?? ""}
                                    onChange={(e) =>
                                        updateWeight(set.setNumber, Number(e.target.value))
                                    }
                                    disabled={set.completed}
                                    className="bg-transparent outline-none text-sm text-center"
                                />

                                <input
                                    type="number"
                                    value={set.reps}
                                    onChange={(e) =>
                                        updateReps(set.setNumber, Number(e.target.value))
                                    }
                                    disabled={set.completed}
                                    className="bg-transparent outline-none text-sm text-center"
                                />

                                <button
                                    onClick={() => toggleComplete(set.setNumber)}
                                    className="flex justify-center"
                                >
                                    <Check
                                        size={20}
                                        className={`rounded-sm ${set.completed
                                            ? "text-green-500 bg-black"
                                            : "text-black bg-gray-600"
                                            }`}
                                    />
                                </button>
                            </div>

                            {/* Delete Popup */}
                            {confirmDeleteSetId === set.setNumber && (
                                <div className="absolute left-2 top-full mt-2 z-20 bg-[#1a1a1a] border border-[#262626] rounded-lg p-3 shadow-xl">
                                    <p className="text-sm mb-2">Delete Set?</p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => deleteSet(set.setNumber)}
                                            className="text-xs bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={() => setConfirmDeleteSetId(null)}
                                            className="text-xs bg-[#262626] hover:bg-[#2e2e2e] px-3 py-1 rounded"
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
                onClick={addWorkoutSet}
                className="w-full py-2 rounded-lg bg-[#262626] hover:bg-[#2e2e2e] text-sm transition"
            >
                + Add Set
            </button>
        </div>
    );
}