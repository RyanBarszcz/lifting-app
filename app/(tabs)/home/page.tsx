"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import WorkoutCard from "@/components/WorkoutCard";
import { useEffect, useState } from "react";

export default function HomePage() {
    const { getToken, isLoaded } = useAuth();
    const [workouts, setWorkouts] = useState([]);
    const { user } = useUser();

    useEffect(() => {
        if (!isLoaded) return;

        const fetchWorkouts = async () => {
            const token = await getToken();

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/sessions`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();
            // console.log("Workouts: ", data);
            setWorkouts(data);
        };

        fetchWorkouts();
    }, [isLoaded, getToken]);

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

                {!isLoaded ? (
                    <p className="text-gray-500 text-sm text-center">
                        Loading...
                    </p>
                ) : workouts.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center justify-content">
                        No completed workouts yet.
                    </p>
                ) : (
                    workouts.map((workout) => (
                        <WorkoutCard key={workout.id} workout={workout} />
                    ))
                )}

            </div>
        </div>
    );
}
