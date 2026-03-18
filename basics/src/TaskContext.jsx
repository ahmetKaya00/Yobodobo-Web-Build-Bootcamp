import { createContext, useState } from "react";

const TaskContext = createContext();

const TaskProvider = ({ children }) => {
    const [tasksList, setTaskList] = useState(['Task 1', 'Task 2', 'Task 3']);

    const addTask = (task) => {
        setTaskList([...tasksList, task]);
    };

    return (
        <TaskContext.Provider value={{  tasksList, addTask }}>
            {children}
        </TaskContext.Provider>
    );
};

export { TaskContext, TaskProvider };
