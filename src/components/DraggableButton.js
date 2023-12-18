import React from "react";

const DraggableButton = ({
  id,
  text,
  onDragStart,
  style,
  onDrag,
  isSelected,
  onSelect,
  type,
  draggedElements,
}) => {
  const handleDragStart = (e) => {
    onSelect && onSelect(id);
    const dragImage = new Image();
    dragImage.src =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/7+goAAAAASUVORK5CYII=";
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    onDragStart && onDragStart(e, id);
  };

  const handleClick = () => {
    onSelect && onSelect(id);
  };

  if (!draggedElements)
    return (
      <div
        id={id}
        className={` p-2 border w-[120px] text-center bg-white mt-4 rounded-lg cursor-move  `}
        draggable="true"
        onDragStart={handleDragStart}
        onClick={handleClick}
        onDrag={(e) => onDrag && onDrag(e)}
      >
        {text}
      </div>
    );
  else {
    return (
      <div
        id={id}
        className={`text-center bg-white  cursor-move `}
        draggable="true"
        onDragStart={handleDragStart}
        onClick={handleClick}
        onDrag={(e) => onDrag && onDrag(e)}
        style={{
          ...style,
          border: isSelected ? "2px solid red" : "2px solid transparent",
        }}
      >
        {type === "label" && <p className="px-4 rounded-md py-2">{text}</p>}
        {type === "input" && (
          <input placeholder="Input" className="outline-none p-2" />
        )}
        {type === "button" && (
          <button className="bg-[#0044C1] cursor-move px-4 py-2 rounded-md text-white">
            {text}
          </button>
        )}
      </div>
    );
  }
};

export default DraggableButton;
