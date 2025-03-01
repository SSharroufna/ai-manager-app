'use client';
import React, { useEffect, useState } from 'react';
import TaskList from '@/components/TaskList';

interface Category {
    category: string;
    tasks: string[];
}

const TaskPage: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const teamMembers = ["Alice", "Bob", "Charlie", "David"];

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/path/to/your/categories.json');
                const data: Category[] = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

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
    );
};

export default TaskPage;