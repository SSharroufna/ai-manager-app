"use client";

import React, { useEffect, useState } from 'react';
import TaskList from '@/components/TaskList';
import Navbar from "@/components/Navbar";

interface Task {
    name: string;
    assignedTo?: string; // Track assigned member
    dueDate?: string; // Optional due date
    completed?: boolean; // Track completion status
}

interface Category {
    category: string;
    tasks: Task[];
}

const TaskPage: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [assignments, setAssignments] = useState<Record<string, string>>({}); // Tracks assigned tasks
    const [taskCompletion, setTaskCompletion] = useState<Record<string, boolean>>({}); // Tracks task completion
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const teamMembers = ["Alice", "Bob", "Charlie", "David"];

    // 🟢 Load saved assignments and completion status from localStorage
    useEffect(() => {
        const savedAssignments = localStorage.getItem('assignments');
        if (savedAssignments) {
            setAssignments(JSON.parse(savedAssignments));
        }

        const savedCompletion = localStorage.getItem('taskCompletion');
        if (savedCompletion) {
            setTaskCompletion(JSON.parse(savedCompletion));
        }
    }, []);

    // 🟢 Load categories from JSON
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/output.json');
                if (!response.ok) {
                    throw new Error('Failed to fetch categories');
                }
                const data: Category[] = await response.json();

                const updatedData: Category[] = data.map(cat => ({
                    category: cat.category,
                    tasks: cat.tasks.map(task => ({
                        name: task.name,
                        dueDate: task.dueDate || undefined, // Add due date if available
                        assignedTo: assignments[task.name] || undefined, // Assign saved data
                        completed: taskCompletion[task.name] || false, // Add completion status
                    }))
                }));

                setCategories(updatedData);
            } catch (error) {
                console.error('Error fetching categories:', error);
                setError('Failed to load tasks. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, [assignments, taskCompletion]); // Update when assignments or completion status change

    // 🟢 Handle assigning tasks and save to localStorage
    const handleAssignTask = (taskName: string, member: string) => {
        const updatedAssignments = { ...assignments, [taskName]: member };
        setAssignments(updatedAssignments);
        localStorage.setItem('assignments', JSON.stringify(updatedAssignments));
    };

    // 🟢 Handle task completion toggle and save to localStorage
    const handleToggleCompletion = (taskName: string) => {
        const updatedCompletion = { ...taskCompletion, [taskName]: !taskCompletion[taskName] };
        setTaskCompletion(updatedCompletion);
        localStorage.setItem('taskCompletion', JSON.stringify(updatedCompletion));
    };

    // 🟢 Clear all assignments
    const handleClearAssignments = () => {
        setAssignments({});
        localStorage.removeItem('assignments');
    };

    if (isLoading) {
        return <div className="text-center py-4">Loading...</div>;
    }

    if (error) {
        return <div className="text-center py-4 text-red-500">{error}</div>;
    }

    return (
        <main className="flex min-h-screen flex-col bg-gray-50">
            <Navbar />
            <div className="flex w-full p-6 gap-8">
                {/* Left side - Task Categories */}
                <div className="w-1/2 bg-white p-4 rounded-lg shadow-md">
                    <h1 className="text-xl font-bold mb-4">Tasks</h1>
                    {categories.map((data, index) => (
                        <div key={index} className="mb-4">
                            <TaskList 
                                tasks={data.tasks} 
                                category={data.category} 
                                teamMembers={teamMembers} 
                                onAssign={handleAssignTask} 
                            />
                        </div>
                    ))}
                </div>

                {/* Right side - Team Member Task Boards */}
                <div className="w-1/2">
                    <h2 className="text-xl font-bold mb-4">Team Members</h2>
                    <div className="flex flex-col gap-4">
                        {teamMembers.map(member => {
                            const assignedTasks = Object.entries(assignments)
                                .filter(([_, assignedMember]) => assignedMember === member)
                                .map(([taskName]) => {
                                    const task = categories
                                        .flatMap(cat => cat.tasks)
                                        .find(task => task.name === taskName);
                                    return { name: taskName, dueDate: task?.dueDate, completed: taskCompletion[taskName] || false };
                                });

                            // Sort tasks: completed tasks at the bottom
                            const sortedTasks = [...assignedTasks].sort((a, b) => {
                                if (a.completed === b.completed) return 0;
                                return a.completed ? 1 : -1;
                            });

                            return (
                                <div key={member} className="bg-white p-4 rounded-lg shadow-md">
                                    <h3 className="text-lg font-semibold">{member}</h3>
                                    <ul className="mt-2">
                                        {sortedTasks.map((task, index) => (
                                            <li
                                                key={index}
                                                className={`p-2 rounded mt-1 flex justify-between items-center ${
                                                    task.completed
                                                        ? "bg-green-100 line-through"
                                                        : "bg-gray-200"
                                                }`}
                                            >
                                                <span>{task.name}</span>
                                                <div className="flex items-center gap-4">
                                                    {task.dueDate && (
                                                        <span className="text-sm text-gray-600">
                                                            Due: {task.dueDate}
                                                        </span>
                                                    )}
                                                    <input
                                                        type="checkbox"
                                                        checked={task.completed || false}
                                                        onChange={() => handleToggleCompletion(task.name)}
                                                        className="cursor-pointer"
                                                    />
                                                </div>
                                            </li>
                                        ))}
                                        {assignedTasks.length === 0 && (
                                            <p className="text-gray-500">No tasks assigned</p>
                                        )}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                    <button
                        onClick={handleClearAssignments}
                        className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    >
                        Clear All Assignments
                    </button>
                </div>
            </div>
        </main>
    );
};

export default TaskPage;