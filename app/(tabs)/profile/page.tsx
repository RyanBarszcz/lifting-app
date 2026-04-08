"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCache, setCache } from "@/lib/cache";
import { useClerk } from "@clerk/nextjs";
import SkeletonProfileHeader from "@/components/SkeletonProfileHeader";
import SkeletonStatCard from "@/components/SkeletonStatCard";


export default function ProfilePage() {
    const [data, setData] = useState<any>(null);
    const { getToken } = useAuth();
    const { user } = useUser();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const { signOut } = useClerk();

    useEffect(() => {
        const fetchProfileData = async () => {
            setLoading(true);

            // await new Promise((res) => setTimeout(res, 2000));


            const cached = getCache("profile");

            if (cached) {
                setData(cached);
                setLoading(false);
            }

            try {
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
                setCache("profile", data);
            } catch (err) {
                console.error("Failed to fetch profile", err);
            } finally {
                setLoading(false);
            }
        }

        fetchProfileData();
    }, []);

    return (
        <div className="w-full text-white px-4">

            {/* Sticky Header */}
            <div className="sticky top-0 z-20 bg-black px-4 pt-6 pb-4 flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Profile</h1>

                <button
                    onClick={() => {
                        localStorage.clear();
                        signOut();
                    }}
                    className="text-white font-semibold rounded-lg bg-red-700 py-2 px-4"
                >
                    Sign Out
                </button>
            </div>

            <div className="px-4 space-y-8 pb-24">

                {/* User Summary */}
                {loading && !data ? (
                    <SkeletonProfileHeader />
                ) : (
                    <div className="bg-[#1a1a1a] border border-[#262626] rounded-2xl p-6 space-y-2">
                        <h2 className="text-xl font-semibold">{user?.fullName}</h2>

                        <p className="text-gray-400 text-sm">
                            {data.workouts} workouts completed
                        </p>

                        <p className="text-sm text-blue-500 mt-1">
                            {data.streak} day streak
                        </p>
                    </div>
                )}

                {/* Stats Section */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Statistics</h2>

                    <div className="grid grid-cols-3 gap-2">
                        {loading && !data ? (
                            [...Array(3)].map((_, i) => <SkeletonStatCard key={i} />)
                        ) : (
                            <>
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
                            </>
                        )}
                    </div>
                </div>

                {/* Averages */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Averages</h2>

                    <div className="grid grid-cols-2 gap-4">
                        {loading && !data ? (
                            [...Array(2)].map((_, i) => <SkeletonStatCard key={i} />)
                        ) : (
                            <>
                                <StatCard
                                    label="Avg Volume"
                                    value={`${data.avgVolume.toLocaleString()} lbs`}
                                />
                                <StatCard
                                    label="Avg Duration"
                                    value={`${data.avgDuration} min`}
                                />
                            </>
                        )}
                    </div>
                </div>
                {/* Action Buttons */}
                <div className="space-y-3">
                    <h2 className="text-lg font-semibold">All Exercises</h2>
                    <button onClick={() => router.push("profile/exercises")} className="w-full bg-[#1a1a1a] border border-[#262626] py-3 rounded-xl hover:bg-[#222] transition">
                        Exercises
                    </button>
                </div>
            </div>
        </div >
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