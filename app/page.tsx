"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Dumbbell } from "lucide-react";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/home");
    }
  }, [isSignedIn, isLoaded, router]);

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-between py-20">

      {/* Center Logo */}
      <div className="flex flex-col items-center mt-32">
        <Dumbbell size={48} className="text-blue-500 mb-4" />
        <h1 className="text-3xl font-bold tracking-tight">
          WorkoutApp
        </h1>
      </div>

      {/* Bottom Buttons */}
      <div className="flex flex-col gap-4 w-full max-w-xs px-6 mb-16">

        <SignInButton mode="modal">
          <button className="w-full bg-[#1a1a1a] border border-[#262626] py-3 rounded-xl font-medium">
            Sign In
          </button>
        </SignInButton>

        <SignUpButton mode="modal">
          <button className="w-full bg-blue-500 py-3 rounded-xl font-semibold">
            Sign Up
          </button>
        </SignUpButton>

      </div>
    </div>
  );
}
