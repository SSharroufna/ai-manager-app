"use client";

import React, { useEffect, useState } from 'react';
import TaskList from '@/components/TaskList';
import Navbar from "@/components/Navbar";

interface Task {
    name: string;
    assignedTo?: string; // Track assigned member
}

interface Category {
    category: string;
    tasks: Task[];
}

const TaskPage: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [assignments, setAssignments] = useState<Record<string, string>>({}); // Tracks assigned tasks

    const teamMembers = ["Alice", "Bob", "Charlie", "David"];

    // 🟢 Load saved assignments from localStorage
    useEffect(() => {
        const savedAssignments = localStorage.getItem('assignments');
        if (savedAssignments) {
            setAssignments(JSON.parse(savedAssignments));
        }
    }, []);

    // 🟢 Load categories from JSON
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/output.json');
                const data: { category: string; tasks: string[] }[] = await response.json();

                const updatedData: Category[] = data.map(cat => ({
                    category: cat.category,
                    tasks: cat.tasks.map(task => ({
                        name: task,
                        assignedTo: assignments[task] || undefined, // Assign saved data
                    }))
                }));

                setCategories(updatedData);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, [assignments]); // Update when assignments change

    // 🟢 Handle assigning tasks and save to localStorage
    const handleAssignTask = (taskName: string, member: string) => {
        const updatedAssignments = { ...assignments, [taskName]: member };
        setAssignments(updatedAssignments);
        localStorage.setItem('assignments', JSON.stringify(updatedAssignments));

        setCategories(prevCategories =>
            prevCategories.map(category => ({
                ...category,
                tasks: category.tasks.map(task =>
                    task.name === taskName ? { ...task, assignedTo: member } : task
                )
            }))
        );
    };

    return (
        <main className="flex min-h-screen flex-col bg-gray-50">
            <Navbar />
            <div className="flex w-full p-6 gap-8">
                {/* Left side - Task Categories */}
                <div className="w-2/3 bg-white p-4 rounded-lg shadow-md">
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
                <div className="w-1/3">
                    <h2 className="text-xl font-bold mb-4">Team Members</h2>
                    <div className="flex flex-col gap-4">
                        {teamMembers.map(member => (
                            <div key={member} className="bg-white p-4 rounded-lg shadow-md">
                                <h3 className="text-lg font-semibold">{member}</h3>
                                <ul className="mt-2">
                                    {Object.entries(assignments)
                                        .filter(([_, assignedMember]) => assignedMember === member)
                                        .map(([taskName], index) => (
                                            <li key={index} className="bg-gray-200 p-2 rounded mt-1">
                                                {taskName}
                                            </li>
                                        )) || <p className="text-gray-500">No tasks assigned</p>}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default TaskPage;
