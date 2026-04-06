"use client";

import { useRouter } from "next/navigation";
import RoutineCard from "@/components/RoutineCard";
import { useWorkout } from "@/context/WorkoutContext";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Routine, APIRoutine } from "@/types";

// interface RoutineExercise {
//     exerciseId: string;
//     name: string;
//     order: number;
//     defaultSets: number;
//     defaultReps: number;
// }

// interface Routine {
//     id: string;
//     title: string;
//     exercises: RoutineExercise[];
// }


export default function WorkoutPage() {
    const router = useRouter();
    const { startWorkout } = useWorkout();
    const { getToken } = useAuth();
    const [routines, setRoutines] = useState<Routine[]>([]);

    useEffect(() => {
        const fetchRoutines = async () => {
            try {
                const token = await getToken();

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/templates`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await res.json();

                console.log("Data: ", data);

                const formatted: Routine[] = data.map((r: APIRoutine) => ({
                    id: r.id,
                    title: r.title,
                    exercises: r.exercises.map((e) => ({
                        id: crypto.randomUUID(), // UI id
                        exerciseId: e.exerciseId, // DB id
                        title: e.name,
                        sets: Array.from({ length: e.defaultSets }, (_, i) => ({
                            id: crypto.randomUUID(),
                            reps: e.defaultReps,
                        })),
                    })),
                }));

                setRoutines(formatted);
                console.log("Formatted: ", formatted);

            } catch (err) {
                console.error("Failed to fetch routines", err);
            }
        };

        fetchRoutines();
    }, [getToken]);

    const handleDeleteRoutine = async (id: string) => {
        try {
            const token = await getToken();

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/templates/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) throw new Error("Failed to delete");

            console.log("Deleted routine: ", id);

            // remove from UI immediately
            setRoutines((prev) => prev.filter((r) => r.id !== id));

        } catch (err) {
            console.error(err);
            alert("Failed to delete routine");
        }
    };

    return (
        <div className="w-full text-white px-4">

            {/* Sticky Header */}
            <div className="sticky top-0 z-20 bg-black px-4 pt-6 pb-4">
                <h1 className="text-2xl font-semibold">Workout</h1>
            </div>

            {/* Scrollable Content */}
            <div className="px-4 space-y-6 pb-24">

                {/* Start Empty */}
                <button
                    onClick={async () => {
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
                                }
                            );

                            if (!res.ok) {
                                throw new Error("Failed to start session");
                            }

                            const data = await res.json();

                            // Save sessionId in context
                            startWorkout(data.id);

                            router.push("/workout/active");
                        } catch (error) {
                            console.error(error);
                            alert("Failed to start workout.");
                        }
                    }}
                    className="w-full bg-white text-black py-3 rounded-xl font-medium"
                >
                    + Start Empty Workout
                </button>

                {/* Routines Section */}
                <div className="space-y-4">

                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Routines</h2>

                        <button
                            onClick={() => router.push("/workout/routines/create")}
                            className="text-lg text-blue-500 font-medium"
                        >
                            + New
                        </button>
                    </div>

                    {routines.length === 0 ? (
                        <p className="text-gray-500 text-sm text-center py-4">
                            No routines yet.
                        </p>
                    ) : (
                        routines.map((routine) => (
                            <RoutineCard key={routine.id} routine={routine} onDelete={handleDeleteRoutine} />
                        ))
                    )}
                </div>

            </div>
        </div >
    );
}
