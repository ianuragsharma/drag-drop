
# Drag Drop


## Installation

Steps to Installation

```bash
  git clone https://github.com/ianuragsharma/drag-drop.git
  cd drag-drop
  npm install 
  npm start
```
    

## Features

- All the necessary Features mentioned in the doc file
- User can also export the current config in JSON file
- Used UUID for unique id generation
- Used Tailwind for CSS



## Documentation

### File Structure
- components: Reusable React components.
- styles: CSS or styling related files.
- App.js: Main application component.
- index.js: Entry point of the application.

DraggableButton:
- Represents a draggable button that can be added to the main area.
- Handles drag events and selection of buttons.
- Displays a red border when selected.

DropArea:
- Represents the main area where buttons can be dropped.
- Handles drop events and drag-over events.
- Displays a list of dropped buttons with their current positions.

App:
- The main application component that integrates DraggableButton and DropArea.
- Manages the state of buttons, droppedButtons, and selectedButton.
- Listens for keyboard events to handle button deletion and modal opening.
- Utilizes local storage to persist the state of droppedButtons.

Modal:
- A modal component for editing the coordinates of a selected button.
- Displays the button's text, X, and Y coordinates in input fields.
- Allows users to save changes, updating the position of the button.

Local Storage Handling:
- The useEffect hook is employed to load the initial state from local storage when the component mounts.
- Changes to the droppedButtons state trigger another useEffect to save the updated state to local storage.
- This ensures that the state is persisted across page refreshes.



