'use client';
import React, { useState } from 'react';

interface TaskItemProps {
    task: string;
    teamMembers: string[];
}

const TaskItem: React.FC<TaskItemProps> = ({ task, teamMembers }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<string | null>(null);

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleMemberSelect = (member: string) => {
        setSelectedMember(member);
        setIsOpen(false);  // Close the menu after selection
    };

    return (
        <li className="p-2 border-b border-gray-200 flex items-center justify-between space-x-4">
            <span className="flex-grow text-left">{task}</span>
            <div className="relative">
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    onClick={toggleMenu}
                >
                    {selectedMember ? `${selectedMember}` : "Assign"}
                </button>
                {isOpen && (
                    <ul className="absolute bg-white shadow-md rounded-lg mt-2 p-2 w-48 border border-gray-300 z-10">
                        {teamMembers.map((member, index) => (
                            <li
                                key={index}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleMemberSelect(member)}
                            >
                                {member}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </li>
    );
};

interface TaskListProps {
    tasks: string[];
    catagory: string;
    teamMembers: string[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks, catagory, teamMembers }) => {
    return (
        <div className="w-full max-w-xl mt-4 mx-auto bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-2 text-center">{catagory}</h3>
            <ul className="list-disc pl-5 w-full">
                {tasks.map((task, index) => (
                    <TaskItem key={index} task={task} teamMembers={teamMembers} />
                ))}
            </ul>
        </div>
    );
};

export default TaskList;