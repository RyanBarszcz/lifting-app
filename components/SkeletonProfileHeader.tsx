export default function SkeletonProfileHeader() {
    return (
        <div className="bg-[#1a1a1a] border border-[#262626] rounded-2xl p-6 space-y-2 animate-pulse">
            <div className="h-5 w-1/2 bg-[#262626] rounded" />
            <div className="h-3 w-1/3 bg-[#262626] rounded" />
            <div className="h-3 w-1/4 bg-[#262626] rounded" />
        </div>
    );
}