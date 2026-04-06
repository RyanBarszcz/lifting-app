import { RoutineProvider } from "@/context/RoutineContext";
import "./globals.css";
import { WorkoutProvider } from "@/context/WorkoutContext";
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
export const metadata = {
  title: "Workout App",
  description: "Performance tracking application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <RoutineProvider>
            <WorkoutProvider>
              {children}
            </WorkoutProvider>
          </RoutineProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
