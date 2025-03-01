'use cleint';
import React, { useState } from 'react'
import TaskList from '@/components/TaskList'

const TaskPage: React.FC = () => {
    const categories = [
        {
            category: "Electronics",
            tasks: ["Task 1", "Task 2", "Task 3"]
        },
        {
            category: "Structures",
            tasks: ["Task 4", "Task 5"]
        },
        {
            category: "Propulsion",
            tasks: ["Task 6", "Task 7", "Task 8"]
        }
    ];

    const teamMembers = ["Alice", "Bob", "Charlie", "David"];

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
            <div className="w-full max-w-3xl text-center">
                <h1 className="text-2xl font-bold mb-20">Tasks</h1>
                {categories.map((category, index) => (
                    <div key={index} className="mb-4">
                        <h2 className="text-xl font-semibold">{category.category}</h2>
                        <TaskList tasks={category.tasks} teamMembers={teamMembers} />
                    </div>
                ))}
            </div>
        </main>
    )
}

export default TaskPage
