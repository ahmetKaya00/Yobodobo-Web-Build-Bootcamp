import { useParams } from "react-router-dom";
import { TaskContext } from "../TaskContext";

function TaskDetail() {
    const {taskId} = useParams();
    const { tasksList } =useContext(TaskContext);
    const task = tasksList[taskId];
  return (
    <div>
      <h1>Task Detail</h1>
      <p>{task}</p>
    </div>
  );
}
export default TaskDetail;