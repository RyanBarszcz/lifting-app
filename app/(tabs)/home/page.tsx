"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import WorkoutCard from "@/components/WorkoutCard";
import { useEffect, useState } from "react";
import SkeletonWorkoutCard from "@/components/SkeletonWorkoutCard";
import { fetchWorkouts } from "@/lib/services/workoutService";
import { handleError } from "@/lib/utils/handleError";
import { toast } from "sonner";
import { WorkoutSummary } from "@/types";

export default function HomePage() {
    const { getToken, isLoaded } = useAuth();
    const [workouts, setWorkouts] = useState<WorkoutSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const { user } = useUser();

    // const fetchWorkouts = async (pageNum = 1) => {
    //     if (pageNum === 1) {
    //         setLoading(true);
    //     } else {
    //         setLoading(true);
    //     }

    //     // await new Promise((res) => setTimeout(res, 2000));

    //     const cached = getCache("workouts");

    //     if (cached && pageNum === 1) {
    //         setWorkouts(cached);
    //         setLoading(false);
    //     }

    //     try {
    //         const token = await getToken();

    //         const res = await fetch(
    //             `${process.env.NEXT_PUBLIC_API_URL}/sessions?page=${pageNum}&limit=10`,
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${token}`,
    //                 },
    //             }
    //         );

    //         const data = await res.json();
    //         // console.log("Workouts: ", data);

    //         if (pageNum === 1) {
    //             setWorkouts(data.sessions);
    //             setCache("workouts", data.sessions);
    //         } else {
    //             setWorkouts((prev) => [...prev, ...data.sessions]);
    //         }

    //         setHasMore(data.hasMore);
    //     } catch (err) {
    //         console.error("Failed to fetch workouts", err);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const loadWorkouts = async (pageNum = 1) => {
        setLoading(true);

        try {
            const token = await getToken();
            if (!token) return;

            // Load user's sessions
            const data = await fetchWorkouts(token, pageNum);

            // Session Pagination
            if (pageNum === 1) {
                setWorkouts(data.sessions);
            } else {
                setWorkouts(prev => [...prev, ...data.sessions]);
            }

            setHasMore(data.hasMore);
        } catch (err) {
            toast.error(handleError(err));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!isLoaded) return;
        loadWorkouts(1);
    }, [isLoaded]);

    return (
        <div className="relative h-screen w-full mx-auto bg-black text-white px-4">
            {/* Sticky Header */}
            <div className="sticky top-0 z-20 bg-black px-4 pt-6 pb-4">
                <h1 className="text-2xl font-semibold">
                    Hello, <span className="text-blue-500">{user?.firstName}</span>
                </h1>
            </div>



            {/* Scrollable Content */}
            {/* TODO: Later add edit workout  */}
            <div className="px-4 overflow-y-auto pb-24 space-y-6">

                {loading && workouts.length === 0 ? (
                    <div className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                            <SkeletonWorkoutCard key={i} />
                        ))}
                    </div>
                ) : workouts.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center justify-content">
                        No completed workouts yet.
                    </p>
                ) : (
                    <>
                        {workouts.map((workout) => (
                            <WorkoutCard key={workout.id} workout={workout} />
                        ))}

                        {hasMore && (
                            <button
                                onClick={() => {
                                    const nextPage = page + 1;
                                    setPage(nextPage);
                                    loadWorkouts(nextPage);
                                }}
                                className="w-full py-3 bg-blue-600 rounded-xl text-white"
                            >
                                Load More
                            </button>
                        )}
                    </>
                )}

            </div>
        </div>
    );
}
