// components/TaskList.tsx

import React from 'react'

interface TaskListProps {
    tasks: string[]
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
    return (
        <div className="w-full max-w-xs mt-4">
            <h3 className="text-lg font-semibold mb-2">Tasks</h3>
            <ul className="list-disc pl-5">
                {tasks.map((task, index) => (
                    <li key={index} className="p-2 border-b border-gray-200">
                        {task}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default TaskList
