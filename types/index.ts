// DATABASE TYPES
export interface DBExercise {
    id: string;
    name: string;
    muscleGroup?: string;
    category?: string;
}



// ROUTINE (TEMPLATE) -----------------------
export interface RoutineSet {
    id: string; // UI only
    reps: number;
}

export interface RoutineExercise {
    id: string;          // UI id
    exerciseId: string;  // DB id
    title: string;
    sets: RoutineSet[];
}

export interface Routine {
    id: string;
    title: string;
    exercises: RoutineExercise[];
}

export interface RoutineState {
    title: string;
    exercises: RoutineExercise[];
}

export interface APIRoutineExercise {
    exerciseId: string;
    name: string;
    order: number;
    defaultSets: number;
    defaultReps: number;
}

export interface APIRoutine {
    id: string;
    title: string;
    exercises: APIRoutineExercise[];
}



// WORKOUT (ACTIVE SESSION) -------------------
export interface WorkoutSet {
    id?: string;
    setNumber: number;
    reps: number;
    weight: number | null;
    completed: boolean;
}

export interface WorkoutExercise {
    id: string;          // UI id
    exerciseId: string;  // DB id
    name: string;
    sets: WorkoutSet[];
}

export interface WorkoutState {
    sessionId: string | null;
    startedAt: number | null;
    exercises: WorkoutExercise[];
}



// START WORKOUT (FROM ROUTINE) ----------------
export interface StartExercise {
    exerciseId: string;
    name: string;
    sets: {
        setNumber: number;
        reps: number;
    }[];
}



// COMPLETE WORKOUT (TO BACKEND) ----------------
export interface CompletedSet {
    setNumber: number;
    weight: number;
    reps: number;
}

export interface CompletedExercise {
    exerciseId: string;
    sets: CompletedSet[];
}



// PREVIOUS WORKOUT DATA -----------------------
export interface PreviousSet {
    setNumber: number;
    weight: number;
    reps: number;
}




// WORKOUT HISTORY / SUMMARY -------------------
export interface WorkoutSummary {
    id: string;
    title: string;
    completedAt: string;
    duration: string;
    records: number;
    totalVolume: number;
    exercises: {
        name: string;
        sets: number;
    }[];
}