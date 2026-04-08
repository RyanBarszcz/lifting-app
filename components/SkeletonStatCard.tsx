export default function SkeletonStatCard() {
    return (
        <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-4 animate-pulse">
            <div className="h-3 w-1/2 bg-[#262626] rounded" />
            <div className="h-5 w-3/4 bg-[#262626] rounded mt-2" />
        </div>
    );
}