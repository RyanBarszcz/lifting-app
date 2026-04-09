export default function SkeletonRoutineCard() {
    return (
        <div className="bg-[#1a1a1a] border border-[#262626] rounded-2xl p-5 space-y-3 animate-pulse">

            {/* Title + Menu */}
            <div className="flex items-start justify-between">
                <div className="h-5 w-1/2 bg-[#262626] rounded" />
                <div className="h-5 w-5 bg-[#262626] rounded-full" />
            </div>

            {/* Exercise preview (2 lines) */}
            <div className="space-y-2">
                <div className="h-3 w-3/4 bg-[#262626] rounded" />
                <div className="h-3 w-2/3 bg-[#262626] rounded" />
            </div>

            {/* Start button */}
            <div className="h-10 w-full bg-blue-500 rounded-xl mt-2" />

        </div>
    );
}