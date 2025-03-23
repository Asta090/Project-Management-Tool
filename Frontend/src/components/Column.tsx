import React from "react";
import styled from "styled-components";
import { Droppable, DroppableStateSnapshot } from "@hello-pangea/dnd";
import Card from "./Card";
import "./scroll.css";

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

interface ColumnProps {
  title: string;
  tasks: Task[];
  id: string;
  onDelete: (taskId: number) => void;
  onEdit: (task: Task) => void;
}

const Container = styled.div`
  background-color: #f4f5f7;
  border-radius: 2.5px;
  width: 350px;
  height: 900px;
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  border: 1px solid gray;
`;

const Title = styled.h3`
  padding: 8px;
  background-color: pink;
  text-align: center;
`;

const TaskList = styled.div<{ isDraggingOver: boolean }>`
  padding: 3px;
  transition: background-color 0.2s ease;
  background-color: ${(props) => (props.isDraggingOver ? "#cceeff" : "#f4f5f7")};
  flex-grow: 1;
  min-height: 100px;
`;

const Column: React.FC<ColumnProps> = ({ title, tasks, id, onDelete, onEdit }) => {
  return (
    <Container className="column">
      <Title
        style={{
          backgroundColor: "lightblue",
          position: "sticky",
          top: "0",
        }}
      >
        {title}
      </Title>
      <Droppable droppableId={id}>
        {(provided, snapshot: DroppableStateSnapshot) => (
          <TaskList
            ref={provided.innerRef}
            {...provided.droppableProps}
            isDraggingOver={snapshot.isDraggingOver}
          >
            {tasks.map((task, index) => (
              <Card
                key={task.id}
                index={index}
                task={task}
                onDelete={onDelete}
                onEdit={onEdit} 
              />
            ))}
            {provided.placeholder}
          </TaskList>
        )}
      </Droppable>
    </Container>
  );
};

export default Column;