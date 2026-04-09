"use client";

import { useRouter } from "next/navigation";
import RoutineCard from "@/components/RoutineCard";
import { useWorkout } from "@/context/WorkoutContext";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Routine } from "@/types";
import { getCache, setCache } from "@/lib/cache";
import SkeletonRoutineCard from "@/components/SkeletonRoutineCard";
import { fetchRoutines, removeRoutine } from "@/lib/services/routineService";
import { startSession } from "@/lib/api/templates";


export default function WorkoutPage() {
    const router = useRouter();
    const { startWorkout } = useWorkout();
    const { getToken, isLoaded } = useAuth();
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [loading, setLoading] = useState(true);


    // Get routines from DB
    useEffect(() => {
        if (!isLoaded) return;

        const load = async () => {
            setLoading(true);

            try {
                const token = await getToken();
                if (!token) return;

                const data = await fetchRoutines(token);
                setRoutines(data);
            } catch (err) {
                console.error("Failed to fetch routines", err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [isLoaded, getToken]);

    const handleDeleteRoutine = async (id: string) => {
        try {
            const token = await getToken();
            if (!token) return;

            await removeRoutine(token, id);

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
                            if (!token) return;

                            const data = await startSession(token);

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

                    {loading && routines.length === 0 ? (
                        <div className="space-y-4">
                            {[...Array(6)].map((_, i) => (
                                <SkeletonRoutineCard key={i} />
                            ))}
                        </div>
                    ) : routines.length === 0 ? (
                        <p className="text-gray-500 text-sm text-center py-4">
                            No routines yet.
                        </p>
                    ) : (
                        routines.map((routine) => (
                            <RoutineCard
                                key={routine.id}
                                routine={routine}
                                onDelete={handleDeleteRoutine}
                            />
                        ))
                    )}
                </div>

            </div>
        </div >
    );
}
