"use client";

import { Award, MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { WorkoutSummary } from '@/types';

// interface Workout {
//     id: string;
//     title: string;
//     completedAt: string;
//     duration: string;
//     records: number;
//     totalVolume: number;
//     exercises: {
//         name: string;
//         sets: number;
//     }[];
// }

export default function WorkoutCard({ workout }: { workout: WorkoutSummary }) {
    const router = useRouter();

    const visibleExercises = workout.exercises.slice(0, 3);
    const remaining = workout.exercises.length - 3;


    return (
        <div
            onClick={() => router.push(`/workout/${workout.id}`)}
            className="bg-[#1a1a1a] border border-[#262626] rounded-2xl p-5 space-y-4 mb-6">

            {/* Title + Date */}
            <div>
                <div className="flex items-start justify-between">

                    {workout.title && (
                        <h2 className="text-xl font-semibold">{workout.title}</h2>
                    )}


                    {/* TODO: Make it open options for workout */}
                    <button className="text-white hover:text-white transition-colors">
                        <MoreHorizontal size={20} />
                    </button>
                </div>

                <p className="text-sm text-gray-500 mt-1">{workout.completedAt}</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 text-md">

                <div className="flex flex-col">
                    <span className="text-gray-500 text-xs tracking-wide">
                        Duration
                    </span>
                    <span className="text-gray-300 font-medium">
                        {workout.duration}
                    </span>
                </div>

                <div className="flex flex-col">
                    <span className="text-gray-500 text-xs tracking-wide">
                        Volume
                    </span>
                    <span className="text-gray-300 font-medium">
                        {workout.totalVolume}
                    </span>
                </div>

                <div className="flex flex-col">
                    <span className="text-gray-500 text-xs tracking-wide">
                        Records
                    </span>
                    <div className="flex items-center gap-1">
                        <Award size={16} className="text-yellow-400" />
                        <span className="text-white font-medium">
                            {workout.records}
                        </span>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className='border-t border-gray-600' />

            {/* Exercise Preview */}
            <div className="space-y-1 text-md text-gray-300">
                {visibleExercises.map((exercise, index) => (
                    <div key={index}>
                        {exercise.sets} sets {exercise.name}
                    </div>
                ))}

                {remaining > 0 && (
                    <div className="text-gray-500">
                        See {remaining} more exercises
                    </div>
                )}
            </div>
        </div>
    );
}
