'use client';
import React, { useState } from 'react';

interface Task {
    name: string;
    assignedTo?: string;
    dueDate?: string;
    completed?: boolean;
}

interface TaskItemProps {
    task: Task; 
    teamMembers: string[];
    onAssign: (task: string, member: string) => void;
    onDragStart: (event: React.DragEvent, taskName: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, teamMembers, onAssign, onDragStart }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <li 
            className="p-2 border-b border-gray-600 flex items-center justify-between space-x-4 cursor-grab"
            draggable
            onDragStart={(event) => onDragStart(event, task.name)} // Drag start event
        >
            <span className="flex-grow text-left">{task.name}</span>
            <div className="flex items-center gap-4">
                {task.dueDate && (
                    <span className="text-sm text-gray-600">
                        Due: {task.dueDate}
                    </span>
                )}
                <div className="relative">
                    <button
                        className={`px-4 py-2 rounded-md ${task.assignedTo ? "bg-gray-400 text-white" : "bg-blue-500 text-white hover:bg-blue-600"}`}
                        onClick={toggleMenu}
                    >
                        {task.assignedTo ? `${task.assignedTo}` : "Assign"}
                    </button>
                    {isOpen && (
                        <ul className="absolute bg-white shadow-md rounded-lg mt-2 p-2 w-48 border border-gray-300 z-10">
                            <li
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                    onAssign(task.name, ""); // Unassign task
                                    setIsOpen(false);
                                }}
                            >
                                Unassign
                            </li>
                            <hr className="my-2 border-gray-300" />
                            {teamMembers.map((member, index) => (
                                <li
                                    key={index}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                        onAssign(task.name, member);
                                        setIsOpen(false);
                                    }}
                                >
                                    {member}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </li>
    );
};

interface TaskListProps {
    tasks: Task[];
    category: string;
    teamMembers: string[];
    onAssign: (task: string, member: string) => void;
    onDragStart: (event: React.DragEvent, taskName: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, category, teamMembers, onAssign, onDragStart }) => {
    return (
        <div className="w-full max-w-xl mt-4 mx-auto flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-4 pb-2 border-b-2 border-gray-600 w-full">
                {category}
            </h3>
            <ul className="list-disc pl-5 w-full">
                {tasks.map((task, index) => (
                    <TaskItem 
                        key={index} 
                        task={task} 
                        teamMembers={teamMembers} 
                        onAssign={onAssign} 
                        onDragStart={onDragStart} // Pass down drag function
                    />
                ))}
            </ul>
        </div>
    );
};

export default TaskList;
