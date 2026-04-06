"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { DBExercise } from "@/types";

export default function ExercisesPage() {
    const router = useRouter();

    const [search, setSearch] = useState("");
    const [exercises, setExercises] = useState<DBExercise[]>([]);

    // Fetch exercises
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
        if (!search) return exercises;

        return exercises.filter((ex) =>
            ex.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, exercises]);

    return (
        <div className="w-full min-h-screen bg-black text-white flex flex-col">

            {/* Sticky Header */}
            <div className="sticky top-0 z-30 bg-black">

                {/* Top Bar */}
                <div className="bg-[#1a1a1a] pt-4 pb-4 px-6 flex items-center justify-between">
                    <h1 className="text-lg font-semibold">Exercises</h1>

                    <button
                        onClick={() => router.back()}
                        className="text-lg text-blue-500 font-medium"
                    >
                        Back
                    </button>
                </div>

                {/* Search */}
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

            {/* Exercise List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">

                {filteredExercises.map((exercise) => (
                    <div
                        key={exercise.id}
                        className="w-full text-left px-4 py-3 rounded-xl bg-[#1a1a1a] hover:bg-[#262626] transition-colors"
                    >
                        {exercise.name}
                    </div>
                ))}

            </div>
        </div>
    );
}