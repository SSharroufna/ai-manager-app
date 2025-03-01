// task-organizer/app/TaskPage/page.tsx

import React from 'react'
// import TaskList from '@/components/TaskList'

const TaskPage: React.FC = () => {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
            <div className="w-full max-w-3xl">
                <h1 className="text-2xl font-bold text-center">Tasks</h1>
                {/*<TaskList />*/}
            </div>
        </main>
    )
}

export default TaskPage