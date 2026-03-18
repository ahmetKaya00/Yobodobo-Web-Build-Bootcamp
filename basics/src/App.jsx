import React from "react";
import TaskList from "./components/tasklist";
import TaskDetail from "./components/TaskDetail";
import { BrowserRouter as Router, Route,  Routes } from "react-router-dom";
import { TaskProvider } from "./TaskContext";
function App() {

  return (
    <div>
      <TaskProvider>
      <Router>
        <Routes>
          <Route path="/" element={<TaskList/>} />
          <Route path="/task/:taskId" element={<TaskDetail />} />
        </Routes>
      </Router>
      </TaskProvider>
    </div>
  );
}

export default App;

