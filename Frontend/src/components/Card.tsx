import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import styled from "styled-components";
import { Avatar, Button } from "antd";

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

interface CardProps {
  task: Task;
  index: number;
  onDelete: (taskId: number) => void;
  onEdit: (task: Task) => void; 
}

const Container = styled.div<{ isDragging: boolean; isBacklog?: boolean }>`
  border-radius: 10px;
  box-shadow: 5px 5px 5px 2px grey;
  padding: 8px;
  color: #000;
  margin-bottom: 8px;
  min-height: 120px;
  margin-left: 10px;
  margin-right: 10px;
  background-color: ${(props) => bgcolorChange(props)};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;

const TextContent = styled.div``;

const Icons = styled.div`
  display: flex;
  justify-content: end;
  padding: 2px;
  gap: 8px;
`;

function bgcolorChange(props: { isDragging: boolean; isBacklog?: boolean }) {
  return props.isDragging
    ? "lightgreen"
    : props.isBacklog
    ? "#F2D7D5"
    : "#EAF4FC";
}

const Card: React.FC<CardProps> = ({ task, index, onDelete, onEdit }) => {
  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided, snapshot) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
        >
          <div style={{ display: "flex", justifyContent: "start", padding: 2 }}>
            <span>
              <small>#{task.id} {"  "}</small>
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "center", padding: 2 }}>
            <TextContent>{task.title}</TextContent>
          </div>
          <Icons>
            <Button type="text" onClick={() => onEdit(task)}>
              Edit
            </Button>
            <Button type="text" danger onClick={() => onDelete(task.id)}>
              Delete
            </Button>
            <Avatar
              onClick={() => console.log(task)}
              src={`https://joesch.moe/api/v1/random?key=${task.id}`}
            />
          </Icons>
        </Container>
      )}
    </Draggable>
  );
};

export default Card;