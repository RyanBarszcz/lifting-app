"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function ProfilePage() {
    const [data, setData] = useState<any>(null);
    const { getToken } = useAuth();
    const { user } = useUser();
    const router = useRouter();

    useEffect(() => {
        const fetchProfileData = async () => {
            const token = await getToken();

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/profile`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();
            setData(data);
        };

        fetchProfileData();
    }, []);

    if (!data) {
        return <div className="text-white p-6">Loading Profile...</div>;
    }

    return (
        <div className="w-full text-white px-4">

            {/* Sticky Header */}
            <div className="sticky top-0 z-20 bg-black px-4 pt-6 pb-4">
                <h1 className="text-2xl font-semibold">Profile</h1>
            </div>

            <div className="px-4 space-y-8 pb-24">

                {/* User Summary */}
                <div className="bg-[#1a1a1a] border border-[#262626] rounded-2xl p-6 space-y-2">
                    <h2 className="text-xl font-semibold">{user?.fullName}</h2>

                    <p className="text-gray-400 text-sm">
                        {data.workouts} workouts completed
                    </p>

                    {/* Streak */}
                    <p className="text-sm text-blue-500 mt-1">
                        {data.streak} day streak
                    </p>
                </div>

                {/* Stats Section */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Statistics</h2>

                    <div className="grid grid-cols-2 gap-4">

                        <StatCard
                            label="Total Volume"
                            value={`${data.totalVolume.toLocaleString()} lbs`}
                        />

                        <StatCard
                            label="Total Duration"
                            value={`${data.totalDurationHours} hrs`}
                        />

                        <StatCard
                            label="Total Reps"
                            value={data.totalReps.toLocaleString()}
                        />

                        <StatCard
                            label="Top Muscle"
                            value={data.topMuscle || "—"}
                        />

                    </div>
                </div>

                {/* Advanced Stats */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Averages</h2>

                    <div className="grid grid-cols-2 gap-4">

                        <StatCard
                            label="Avg Volume"
                            value={`${data.avgVolume.toLocaleString()} lbs`}
                        />

                        <StatCard
                            label="Avg Duration"
                            value={`${data.avgDuration} min`}
                        />

                    </div>
                </div>

                {/*  Recent Workouts */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Recent Workouts</h2>

                    {data.recentWorkouts.length === 0 && (
                        <p className="text-gray-500 text-sm">
                            No workouts yet
                        </p>
                    )}

                    {data.recentWorkouts.map((w: any) => (
                        <div
                            key={w.id}
                            className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-4"
                        >
                            <p className="text-sm">
                                Workout
                            </p>

                            <p className="text-xs text-gray-400">
                                {new Date(w.date).toLocaleDateString()} •{" "}
                                {new Date(w.date).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={() => router.push("profile/exercises")}
                        className="w-full bg-[#1a1a1a] border border-[#262626] py-3 rounded-xl hover:bg-[#222] transition">
                        Exercises
                    </button>
                </div>

            </div>
        </div>
    );
}

function StatCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-4">
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-lg font-semibold mt-1">{value}</p>
        </div>
    );
}