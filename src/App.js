import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "./styles.css";
import Modal from "./components/Modal";
import DraggableButton from "./components/DraggableButton";
import DropArea from "./components/DropArea";
import downloadJson from "./utils/donwloadJson";

const App = () => {
  const [buttons, setButtons] = useState([
    { id: uuidv4(), type: "label", text: "Label" },
    { id: uuidv4(), type: "input", text: "Input" },
    { id: uuidv4(), type: "button", text: "Button" },
  ]);
  const [droppedButtons, setDroppedButtons] = useState(
    JSON.parse(localStorage.getItem("droppedButtons")) || []
  );
  const [selectedButton, setSelectedButton] = useState(null);
  const modalRef = useRef(true);

  useEffect(() => {
    const storedButtons = localStorage.getItem("droppedButtons");
    if (storedButtons) {
      setDroppedButtons(JSON.parse(storedButtons));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("droppedButtons", JSON.stringify(droppedButtons));
  }, [droppedButtons]);

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData("buttonId", id);
  };

  const handleDrop = (draggedId, mouseX, mouseY) => {
    const draggedButton = buttons.find((button) => button.id === draggedId);

    if (draggedButton) {
      const isFromSidebar = !droppedButtons.some(
        (button) => button.id === draggedButton.id
      );

      if (isFromSidebar) {
        const newButton = {
          id: uuidv4(),
          text: draggedButton.text,
          type: draggedButton.type,
          style: {
            position: "absolute",
            top: mouseY - 100,
            left: mouseX - 100,
            fontSize: "16px",
            fontWeight: 400,
          },
        };

        setDroppedButtons((prevDroppedButtons) => [
          ...prevDroppedButtons,
          newButton,
        ]);

        setSelectedButton(newButton);
        handleOpen();
      } else {
        setDroppedButtons((prevDroppedButtons) =>
          prevDroppedButtons.map((button) =>
            button.id === draggedButton.id
              ? {
                  ...button,
                  style: {
                    ...button.style,
                    top: mouseY - 100,
                    left: mouseX - 100,
                  },
                }
              : button
          )
        );
      }
    }

    localStorage.setItem("droppedButtons", JSON.stringify(droppedButtons));
  };

  const handleMainAreaDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrag = (e, id) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const mainArea = document.querySelector(".main-area");
    const mainAreaRect = mainArea.getBoundingClientRect();

    const button = droppedButtons.find((button) => button.id === id);
    const buttonRect = document.getElementById(id).getBoundingClientRect();

    const newPosition = {
      top: mouseY,
      left: mouseX,
    };

    if (newPosition.top < mainAreaRect.top) {
      newPosition.top = mainAreaRect.top;
    } else if (newPosition.top + buttonRect.height > mainAreaRect.bottom) {
      newPosition.top = mainAreaRect.bottom - buttonRect.height;
    }

    if (newPosition.left < mainAreaRect.left) {
      newPosition.left = mainAreaRect.left;
    } else if (newPosition.left + buttonRect.width > mainAreaRect.right) {
      newPosition.left = mainAreaRect.right - buttonRect.width;
    }

    setDroppedButtons((prevDroppedButtons) =>
      prevDroppedButtons.map((btn) =>
        btn.id === id
          ? { ...btn, style: { ...btn.style, ...newPosition } }
          : btn
      )
    );
  };

  const handleSelect = (id) => {
    const selectedBtn = droppedButtons.find((button) => button.id === id);
    setSelectedButton(selectedBtn || null);
  };

  const handleKeyPress = (e) => {
    if (
      (e.key === "Delete" || e.key === "Backspace") &&
      selectedButton &&
      !modalRef.current.showModal
    ) {
      setDroppedButtons((prevDroppedButtons) =>
        prevDroppedButtons.filter((button) => button.id !== selectedButton.id)
      );

      setSelectedButton(null);
    } else if (e.key === "Enter" && selectedButton) {
      handleOpen();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [selectedButton]);

  const handleOpen = () => {
    modalRef.current?.onOpen();
  };

  const handleSaveChanges = ({ x, y, style }) => {
    setDroppedButtons((prevDroppedButtons) =>
      prevDroppedButtons.map((button) =>
        button.id === selectedButton.id
          ? {
              ...button,
              style: {
                ...button.style,
                ...style,
                top: parseInt(y),
                left: parseInt(x),
              },
            }
          : button
      )
    );

    modalRef.current?.onClose();

    localStorage.setItem("droppedButtons", JSON.stringify(droppedButtons));
  };

  const ModalContent = ({ selectedButton, onSaveChanges }) => {
    const [xCoordinate, setXCoordinate] = useState(
      selectedButton?.style?.left || ""
    );
    const [yCoordinate, setYCoordinate] = useState(
      selectedButton?.style?.top || ""
    );
    const [style, setStyle] = useState({
      fontWeight: selectedButton?.style?.fontWeight,
      fontSize: selectedButton?.style?.fontSize,
    });

    const handleSaveChanges = () => {
      onSaveChanges({ x: xCoordinate, y: yCoordinate, style });
    };

    useEffect(() => {
      setXCoordinate(selectedButton?.style?.left || "");
      setYCoordinate(selectedButton?.style?.top || "");
    }, [selectedButton]);

    return (
      <div className="p-4 border-t-2 border-solid border-slate-200 w-[520px]">
        <p>{selectedButton?.text}</p>
        <p className="mt-2">X</p>
        <input
          className="border-solid w-full p-1 border-gray-400 border-2 rounded-md"
          value={xCoordinate}
          onChange={(e) => setXCoordinate(e.target.value)}
        />
        <p className="mt-2">Y</p>
        <input
          className="border-solid w-full p-1 border-gray-400 border-2 rounded-md"
          value={yCoordinate}
          onChange={(e) => setYCoordinate(e.target.value)}
        />
        <p className="mt-2">Font Size</p>
        <input
          className="border-solid w-full p-1 border-gray-400 border-2 rounded-md"
          value={style.fontSize}
          onChange={(e) =>
            setStyle((prev) => ({ ...prev, fontSize: e.target.value }))
          }
        />
        <p className="mt-2">Font Weight</p>
        <input
          className="border-solid w-full p-1 border-gray-400 border-2 rounded-md"
          value={style.fontWeight}
          onChange={(e) =>
            setStyle((prev) => ({ ...prev, fontWeight: e.target.value }))
          }
        />
        <div>
          <button
            className="px-4 py-2 bg-[#0044C1] text-white mt-4 rounded-md"
            onClick={handleSaveChanges}
          >
            Save Changes
          </button>
        </div>
      </div>
    );
  };

  const handleExport = () => {
    const data = JSON.parse(localStorage.getItem("droppedButtons")) || [];
    downloadJson(data, "config");
  };

  return (
    <div className=" flex md:h-screen">
      <Modal
        title={"Edit"}
        ref={modalRef}
        body={
          <ModalContent
            selectedButton={selectedButton}
            onSaveChanges={handleSaveChanges}
          />
        }
      />
      <DropArea
        onDrop={handleDrop}
        droppedButtons={droppedButtons}
        onDragOver={handleMainAreaDragOver}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        selectedButton={selectedButton}
        handleSelect={handleSelect}
      />
      <div className="md:w-1/4 w-full h-60 md:h-screen p-4 border-r bg-neutral-900">
        <h2 className="text-lg font-bold mb-4 text-white border-b-2 border-solid border-slate-400">
          Blocks
        </h2>
        {buttons.map((button) => (
          <DraggableButton
            key={button.id}
            {...button}
            isSelected={selectedButton && selectedButton.id === button.id}
            onSelect={handleSelect}
            onDragStart={(e) => handleDragStart(e, button.id)}
            onDrag={(e) => handleDrag(e, button.id)}
          />
        ))}

        <button
          onClick={handleExport}
          className=" px-8 text-white  py-2 hover:bg-emerald-800 bg-emerald-700 t rounded-xl mt-4"
        >
          Export
        </button>
      </div>
    </div>
  );
};

export default App;
