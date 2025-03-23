import { useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import Column from "./Column";
import "./Board.css";



interface Task {
  id: number;
  title: string;
  completed: boolean;
}

enum ColumnId {
  TO_DO = "1",
  DONE = "2",
  IN_REVIEW = "3",
  BACKLOG = "4",
}

interface BoardProps {
  incomplete: Task[];
  completed: Task[];
  inReview: Task[];
  backlog: Task[];
  setIncomplete: React.Dispatch<React.SetStateAction<Task[]>>;
  setCompleted: React.Dispatch<React.SetStateAction<Task[]>>;
  setInReview: React.Dispatch<React.SetStateAction<Task[]>>;
  setBacklog: React.Dispatch<React.SetStateAction<Task[]>>;
  nextTaskId: number;
  setNextTaskId: React.Dispatch<React.SetStateAction<number>>;
}

export default function Board({
  incomplete,
  completed,
  inReview,
  backlog,
  setIncomplete,
  setCompleted,
  setInReview,
  setBacklog,
  nextTaskId,
  setNextTaskId,

}: BoardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null); // Track task being edited

  // Create: Add a new task
  const handleAddTask = () => {
    setEditingTask(null); // Reset editing task
    setIsModalOpen(true);
  };

  // Save task (Create or Update)
  const handleSaveTask = (task: Task) => {
    if (editingTask) {
      // Update existing task
      const updatedTask = { ...editingTask, title: task.title };
      updateTask(updatedTask);
    } else {
      // Create new task
      const newTask = { ...task, id: nextTaskId };
      setIncomplete((prev) => [newTask, ...prev]);
      setNextTaskId((prev) => prev + 1); // Increment task ID
    }
    setIsModalOpen(false);
  };

  // Update: Modify an existing task
  const updateTask = (updatedTask: Task) => {
    const updateState = (prev: Task[]) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task));
    setIncomplete(updateState);
    setCompleted(updateState);
    setInReview(updateState);
    setBacklog(updateState);
  };

  // Delete: Remove a task
  const handleDeleteTask = (taskId: number) => {
    const removeTask = (prev: Task[]) => prev.filter((task) => task.id !== taskId);
    setIncomplete(removeTask);
    setCompleted(removeTask);
    setInReview(removeTask);
    setBacklog(removeTask);
  };

  // Drag and drop logic
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination || source.droppableId === destination.droppableId) return;

    const task = findItemById(Number(draggableId), [
      ...incomplete,
      ...completed,
      ...inReview,
      ...backlog,
    ]);

    if (task) {
      deletePreviousState(source.droppableId, task.id);
      setNewState(destination.droppableId, task);
    }
  };

  const deletePreviousState = (sourceDroppableId: string, taskId: number) => {
    const updateState = (prev: Task[]) => removeItemById(taskId, prev);
    switch (sourceDroppableId) {
      case ColumnId.TO_DO:
        setIncomplete(updateState);
        break;
      case ColumnId.DONE:
        setCompleted(updateState);
        break;
      case ColumnId.IN_REVIEW:
        setInReview(updateState);
        break;
      case ColumnId.BACKLOG:
        setBacklog(updateState);
        break;
    }
  };

  const setNewState = (destinationDroppableId: string, task: Task) => {
    const updatedTask = { ...task, completed: destinationDroppableId === ColumnId.DONE };
    const updateState = (prev: Task[]) => [updatedTask, ...prev];
    switch (destinationDroppableId) {
      case ColumnId.TO_DO:
        setIncomplete(updateState);
        break;
      case ColumnId.DONE:
        setCompleted(updateState);
        break;
      case ColumnId.IN_REVIEW:
        setInReview(updateState);
        break;
      case ColumnId.BACKLOG:
        setBacklog(updateState);
        break;
    }
  };

  const findItemById = (id: number, array: Task[]): Task | undefined => {
    return array.find((item) => item.id === id);
  };

  const removeItemById = (id: number, array: Task[]): Task[] => {
    return array.filter((item) => item.id !== id);
  };

  // Modal styles
  const modalStyles = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    zIndex: 1000,
  };

  const overlayStyles = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
  };

  return (
    <div className="kanban-page">
  
    <div className="kanban-wrapper">
     <div className="kanban-container">
    
      <DragDropContext onDragEnd={handleDragEnd}>
       <div style={{ textAlign: "center" }}>
         <h2>KANBAN BOARD</h2>
        <button
          onClick={handleAddTask}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          Add Task
        </button>
      </div>

      {/*  */}
      {isModalOpen && (
        <>
          <div style={overlayStyles} onClick={() => setIsModalOpen(false)} />
          <div style={modalStyles}>
            <h3>{editingTask ? "Edit Task" : "Add New Task"}</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const title = e.currentTarget.taskTitle.value;
                handleSaveTask({ id: editingTask?.id || nextTaskId, title, completed: false });
              }}
            >
              <input
                type="text"
                name="taskTitle"
                placeholder="Task title"
                defaultValue={editingTask?.title || ""}
                required
                style={{ width: "100%", padding: "8px 0px",marginBottom: "10px", }}
              />
              <button type="submit" style={{ marginRight: "10px" }}>
                {editingTask ? "Update" : "Save"}
              </button>
              <button type="button" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
            </form>
          </div>
        </>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          width: "1000px",
          margin: "0 auto",
          justifyItems:"center",
        
        }}
      >
        <Column
          title="TO DO"
          tasks={incomplete}
          id={ColumnId.TO_DO}
          onDelete={handleDeleteTask}
          onEdit={(task) => {
            setEditingTask(task); // Set task to edit
            setIsModalOpen(true); // Open modal
          }}
        />
        <Column
          title="DONE"
          tasks={completed}
          id={ColumnId.DONE}
          onDelete={handleDeleteTask}
          onEdit={(task) => {
            setEditingTask(task);
            setIsModalOpen(true);
          }}
        />
        <Column
          title="IN REVIEW"
          tasks={inReview}
          id={ColumnId.IN_REVIEW}
          onDelete={handleDeleteTask}
          onEdit={(task) => {
            setEditingTask(task);
            setIsModalOpen(true);
          }}
        />
        <Column
          title="BACKLOG"
          tasks={backlog}
          id={ColumnId.BACKLOG}
          onDelete={handleDeleteTask}
          onEdit={(task) => {
            setEditingTask(task);
            setIsModalOpen(true);
          }}
        />
      </div>
    </DragDropContext>
    </div>
    </div>
    </div>
     
    
  );
}
