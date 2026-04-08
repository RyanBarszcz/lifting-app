"use client";

import {
    DndContext,
    closestCenter,
    useSensor,
    useSensors,
    PointerSensor,
    TouchSensor,
    DragStartEvent,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { useWorkout } from "@/context/WorkoutContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { WorkoutExercise } from "@/types";


function SortableItem({ exercise }: { exercise: WorkoutExercise }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: exercise.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`bg-[#1a1a1a] border border-[#262626] px-4 py-4 rounded-xl mb-3 flex items-center justify-between transition 
      ${isDragging ? "scale-105 shadow-xl opacity-90" : ""}`}
        >
            {/* Exercise Name */}
            <span className="text-sm select-none">{exercise.name}</span>

            {/* Drag Handle */}
            <button
                {...attributes}
                {...listeners}
                style={{ touchAction: "none" }}
                className="p-2 cursor-grab active:cursor-grabbing text-gray-500 hover:text-white"
            >
                <GripVertical size={18} />
            </button>
        </div>
    );
}

export default function ReorderPage() {
    const router = useRouter();
    const { workout, reorderExercises } = useWorkout();
    const [dragging, setDragging] = useState(false);

    const exercises = workout.exercises;

    // Sensors for proper desktop + mobile behavior
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 6, // require slight movement before drag on desktop
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250, // long press on mobile
                tolerance: 5,
            },
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setDragging(true);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setDragging(false);

        const { active, over } = event;

        if (!over || active.id === over.id) return;

        const oldIndex = exercises.findIndex((e) => e.id === active.id);
        const newIndex = exercises.findIndex((e) => e.id === over.id);

        const newOrder = arrayMove(exercises, oldIndex, newIndex);
        reorderExercises(newOrder);
    };

    return (
        <div className="min-h-screen bg-black text-white px-6 py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-lg font-semibold">Reorder Exercises</h1>

                {!dragging && (
                    <button
                        onClick={() => router.back()}
                        className="text-blue-500 font-medium transition-opacity"
                    >
                        Done
                    </button>
                )}
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={exercises.map((e) => e.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {exercises.map((exercise) => (
                        <SortableItem key={exercise.id} exercise={exercise} />
                    ))}
                </SortableContext>
            </DndContext>
        </div>
    );
}
