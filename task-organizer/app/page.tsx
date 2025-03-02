'use client';
import React, { useEffect, useState } from 'react';
import TaskList from '@/components/TaskList';
import Navbar from "@/components/Navbar";

interface data {
    category: string;
    tasks: string[];
}

const TaskPage: React.FC = () => {
    const [categories, setCategories] = useState<data[]>([]);
    const teamMembers = ["Alice", "Bob", "Charlie", "David"];

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/output.json');
                const data: data[] = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
            <Navbar /> {/* Add Navbar at the top */}
            <div className="w-full max-w-3xl text-center mt-8">
                <h1 className="text-2xl font-bold mb-20">Tasks</h1>
                {categories.map((data, index) => (
                    <div key={index} className="mb-4">
                        <TaskList tasks={data.tasks} catagory={data.category} teamMembers={teamMembers} />
                    </div>
                ))}
            </div>
        </main>
    );
};

export default TaskPage;