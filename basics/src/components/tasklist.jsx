import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TaskContext } from '../TaskContext';
import alertify from 'alertifyjs';
import { Alert, Button, Input, ListGroup, ListGroupItem } from 'reactstrap';

function tasklist() {
    const { tasksList, addTask } = React.useContext(TaskContext);
    const [newTask, setNewTask] = useState('');
    const[error, setError] = useState('');

    const handleAddTask = () => {
        if (newTask.trim() === '') {
            setError('Task cannot be empty.');
            return;
        } else {
            addTask(newTask);
            setNewTask('');
            setError('');
            alertify.success('Task added successfully!');
        }
    };
    return(
        <div className='container mt-4'>
            <h1 className='mb-4'>Task List</h1>

            {tasksList.length === 0 ? (
                <Alert color="warning">No tasks available. Please add a task.</Alert>
            ) : (
                <ListGroup>
                    {tasksList.map((task, index) => (
                        <ListGroupItem key={index}>{task} - <Link to={`/task/${index}`}>View Details</Link></ListGroupItem>
                    ))}
                </ListGroup>
            )}

            <Input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a new task"
            />
            <Button color="primary" onClick={handleAddTask} className="mt-2">
                Add Task
            </Button>
            {error && <Alert color="danger">{error}</Alert>}
        </div>
    );
};

export default tasklist;