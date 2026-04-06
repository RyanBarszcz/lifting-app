import { RoutineProvider } from "@/context/RoutineContext";
import "./globals.css";
import { WorkoutProvider } from "@/context/WorkoutContext";
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
export const metadata = {
  title: "Workout App",
  description: "Performance tracking application",
};
import { Toaster } from "sonner";

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
              <Toaster theme="dark" />
            </WorkoutProvider>
          </RoutineProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
