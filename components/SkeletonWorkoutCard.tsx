export default function SkeletonWorkoutCard() {
    return (
        <div className="bg-[#1a1a1a] border border-[#262626] rounded-2xl p-5 space-y-4 mb-6 animate-pulse">

            {/* Title + Date */}
            <div>
                <div className="flex items-start justify-between">
                    <div className="h-5 w-1/2 bg-[#262626] rounded" />
                    <div className="h-5 w-5 bg-[#262626] rounded-full" />
                </div>

                <div className="h-3 w-1/3 bg-[#262626] rounded mt-2" />
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4">

                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex flex-col space-y-1">
                        <div className="h-2 w-12 bg-[#262626] rounded" />
                        <div className="h-4 w-16 bg-[#262626] rounded" />
                    </div>
                ))}

            </div>

            {/* Divider */}
            <div className="border-t border-gray-700" />

            {/* Exercise Preview */}
            <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-3 w-3/4 bg-[#262626] rounded" />
                ))}
            </div>

        </div>
    );
}