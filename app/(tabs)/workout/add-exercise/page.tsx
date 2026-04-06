"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useWorkout } from "@/context/WorkoutContext";
import { DBExercise } from "@/types";

// TODO: Replace with GET /exercises
const ALL_EXERCISES = [
    "Bench Press",
    "Incline Dumbbell Press",
    "Seated Shoulder Press",
    "Chest Fly",
    "Lateral Raise",
    "Tricep Pushdown",
    "Overhead Extension",
    "Lat Pulldown",
    "Seated Row",
    "Back Extension",
    "Rear Delt Fly",
    "Preacher Curl",
    "Hammer Curl",
    "Incline Curl",
    "Hack Squat",
    "Seated Leg Curl",
    "Calf Raise",
    "Glute Kickback",
    "Hip Adduction",
    "Hip Abduction",
    "Cable Crunch",
    "Oblique Twist",
];

// interface Exercise {
//     id: string,
//     name: string,
//     muscleGroup?: string,
//     category?: string,
// }

export default function AddExercisePage() {
    const router = useRouter();
    const { addExercises } = useWorkout();

    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<DBExercise[]>([]);
    const [exercises, setExercises] = useState<DBExercise[]>([]);

    // Get exercises from DB
    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/exercises`
                );
                const data = await res.json();
                setExercises(data);
            } catch (err) {
                console.error("Failed to fetch exercises", err);
            }
        };

        fetchExercises();
    }, []);


    const filteredExercises = useMemo(() => {
        const sorted = [...ALL_EXERCISES].sort((a, b) =>
            a.localeCompare(b)
        );

        if (!search) return sorted;

        return sorted.filter((ex) =>
            ex.toLowerCase().includes(search.toLowerCase())
        );
    }, [search]);

    const toggleExercise = (exercise: DBExercise) => {
        setSelected((prev) =>
            prev.some((e) => e.id === exercise.id)
                ? prev.filter((e) => e.id !== exercise.id)
                : [...prev, exercise]
        );
    };

    return (
        <div className="w-full min-h-screen bg-black text-white flex flex-col">
            {/* Sticky */}
            <div className="sticky top-0 z-30 bg-black">
                {/* Top Bar */}
                <div className="bg-[#1a1a1a] pt-4 pb-4 px-6 flex items-center justify-between">
                    <h1 className="text-lg font-semibold">Add Exercise</h1>

                    {/* Cancel Button */}
                    <button
                        onClick={() => router.back()}
                        className="text-lg text-blue-500 font-medium"
                    >
                        Cancel
                    </button>
                </div>

                {/* Search Bar */}
                <div className="px-6 py-4 border-b border-[#262626]">
                    <div className="flex items-center bg-[#1a1a1a] rounded-xl px-4 py-3">
                        <Search size={18} className="text-gray-500 mr-2" />
                        <input
                            type="text"
                            placeholder="Search exercise..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-transparent outline-none w-full text-sm placeholder-gray-500"
                        />
                    </div>
                </div>
            </div>

            {/* Scrollable */}
            {/* Exercise List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2 pb-32">

                {exercises
                    .filter((ex) =>
                        ex.name.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((exercise) => {
                        const isSelected = selected.some(e => e.id === exercise.id);

                        return (
                            <button
                                key={exercise.id}
                                onClick={() => toggleExercise(exercise)}
                                className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${isSelected
                                    ? "bg-blue-500 text-white"
                                    : "bg-[#1a1a1a] hover:bg-[#262626]"
                                    }`}
                            >
                                {exercise.name}
                            </button>
                        );
                    })}

            </div>

            {/* Bottom Add Button */}
            {selected.length > 0 && (
                <div className="fixed bottom-16 left-0 right-0 p-6">
                    <button
                        onClick={() => {
                            addExercises(selected);
                            router.push("/workout/active");

                            console.log(selected);
                        }}
                        className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold"
                    >
                        Add {selected.length} Exercise
                        {selected.length > 1 ? "s" : ""}
                    </button>
                </div>
            )}

        </div>
    );
}
