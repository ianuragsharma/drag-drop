import React from "react";
import DraggableButton from "./DraggableButton";

const DropArea = ({
  onDrop,
  droppedButtons,
  onDragOver,
  onDragStart,
  onDrag,
  selectedButton,
  handleSelect,
}) => {
  const handleDrop = (e) => {
    e.preventDefault();
    const buttonId = e.dataTransfer.getData("buttonId");
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    onDrop(buttonId, mouseX, mouseY);
  };

  return (
    <div
      className="flex-1  border border-dashed relative h-full bg-slate-50 main-area"
      onDrop={handleDrop}
      onDragOver={onDragOver}
    >
      {droppedButtons.map((button) => (
        <DraggableButton
          key={button.id}
          draggedElements={true}
          {...button}
          isSelected={selectedButton && selectedButton.id === button.id}
          onSelect={handleSelect}
          onDragStart={(e) => onDragStart(e, button.id)}
          onDrag={(e) => onDrag && onDrag(e, button.id)}
        />
      ))}
    </div>
  );
};

export default DropArea;
