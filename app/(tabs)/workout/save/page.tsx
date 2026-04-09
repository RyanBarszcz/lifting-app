"use client";

import { Suspense } from "react";
import SaveWorkoutContent from "@/components/SaveWorkoutContent";

export default function Page() {
    return (
        <Suspense fallback={<div className="text-white p-4">Loading...</div>}>
            <SaveWorkoutContent />
        </Suspense>
    );
}