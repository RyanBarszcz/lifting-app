"use client";

import { CompletedSet } from "@/types";

interface ExerciseHistory {
    name: string;
    sets: CompletedSet[];
}

// interface Set {
//     weight: number;
//     reps: number;
// }

// interface Exercise {
//     id: string;
//     name: string;
//     sets: Set[];
// }

export default function ExerciseHistoryCard({ exercise }: { exercise: ExerciseHistory }) {
    return (
        <div className="bg-[#1a1a1a] border border-[#262626] rounded-2xl p-5 space-y-4">

            {/* Header */}
            <h2 className="text-blue-500 text-lg font-semibold">
                {exercise.name}
            </h2>

            {/* Column Labels */}
            <div className="grid grid-cols-3 gap-x-2 text-xs text-gray-400 px-4">
                <span>SET</span>
                <span className="text-center">WEIGHT & REPS</span>
            </div>

            {/* Sets */}
            <div className="space-y-1">
                {exercise.sets.map((set, index) => {
                    const isEven = index % 2 === 0;

                    return (
                        <div
                            key={set.setNumber}
                            className={`grid grid-cols-3 gap-x-6 px-4 py-2 rounded-lg text-sm ${isEven ? "bg-black" : "bg-[#121212]"
                                }`}
                        >
                            <span>{index + 1}</span>
                            <span className="text-center">{set.weight} x {set.reps}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}