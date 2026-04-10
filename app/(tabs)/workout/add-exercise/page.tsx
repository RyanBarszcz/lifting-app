"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useWorkout } from "@/context/WorkoutContext";
import { DBExercise } from "@/types";
import { getCache } from "@/lib/cache";
import SkeletonExerciseRow from "@/components/SkeletonExerciseRow";
import { getExercises } from "@/lib/api/exercises";
import { handleError } from "@/lib/utils/handleError";
import { toast } from "sonner";

export default function AddExercisePage() {
    const router = useRouter();
    const { addExercises } = useWorkout();
    const [adding, setAdding] = useState(false);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<DBExercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [exercises, setExercises] = useState<DBExercise[]>(() => {
        if (typeof window !== "undefined") {
            return getCache("exercises") || [];
        }
        return [];
    });

    // Get exercises from DB
    useEffect(() => {
        const fetchExercises = async () => {
            setLoading(true);

            // Testing for skeleton
            // await new Promise((res) => setTimeout(res, 2000));

            try {
                const data = await getExercises();
                setExercises(data);
            } catch (err) {
                toast.error(handleError(err));
            } finally {
                setLoading(false);
            }
        };

        fetchExercises();
    }, []);

    const filteredExercises = useMemo(() => {
        return exercises
            .filter((ex) =>
                ex.name.toLowerCase().includes(search.toLowerCase())
            )
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [search, exercises]);

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

                {loading && exercises.length === 0 ? (
                    <>
                        {[...Array(12)].map((_, i) => (
                            <SkeletonExerciseRow key={i} />
                        ))}
                    </>
                ) : filteredExercises.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center mt-10">
                        No exercises found
                    </p>
                ) : (
                    filteredExercises.map((exercise) => {
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
                    })
                )}

            </div>
            {/* Bottom Add Button */}
            {selected.length > 0 && (
                <div className="fixed bottom-16 left-0 right-0 p-6">
                    <button
                        // Prevent double clicking
                        disabled={adding}
                        onClick={async () => {
                            setAdding(true);

                            addExercises(selected);
                            router.push("/workout/active");

                            // console.log(selected);
                        }}
                        className={`w-full text-white py-3 rounded-xl font-semibold
                            ${adding ? "bg-gray-500" : "bg-blue-500"
                            }`}
                    >
                        Add {selected.length} Exercise
                        {selected.length > 1 ? "s" : ""}
                    </button>
                </div>
            )}

        </div>
    );
}
