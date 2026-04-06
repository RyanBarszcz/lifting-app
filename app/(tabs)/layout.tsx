"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Dumbbell, User } from 'lucide-react';

export default function TabsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const navItem = (
        href: string,
        label: string,
        Icon: React.ElementType
    ) => {
        const active = pathname.startsWith(href);

        return (
            <Link
                href={href}
                className="flex-1 flex flex-col items-center justify-center py-2"
            >
                <Icon
                    size={30}
                    className={`mb-1 transition-colors ${active ? "text-blue-500" : "text-gray-500"
                        }`}
                />
                <span
                    className={`text-xs transition-colors ${active ? "text-blue-500" : "text-gray-500"
                        }`}
                >
                    {label}
                </span>
            </Link>
        );
    };

    return (
        <div className="min-h-screen flex flex-col bg-black">

            {/* Main Content */}
            <main className="flex-1 max-w-md mx-auto w-full pb-24">
                {children}
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-[#262626] max-w-md mx-auto flex">
                {navItem("/home", "Home", Home)}
                {navItem("/workout", "Workout", Dumbbell)}
                {navItem("/profile", "Profile", User)}
            </nav>
        </div>
    );
}
