import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Header from "./header";
import AppContext from "../../context";

describe("Header Component", () => {
  const mockDispatch = jest.fn();
  const mockOnOpenTaskModal = jest.fn();
  const mockOnOpenCustomFieldsModal = jest.fn();

  const renderHeader = (history = [], future = []) => {
    render(
      <AppContext.Provider value={{
        dispatch: mockDispatch,
        history,
        future,
        ACTIONS: { UNDO: "UNDO", REDO: "REDO" }
      }}>
        <Header 
          onOpenTaskModal={mockOnOpenTaskModal} 
          onOpenCustomFieldsModal={mockOnOpenCustomFieldsModal} 
        />
      </AppContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders all buttons correctly", () => {
    renderHeader();

    expect(screen.getByText("⬅ Undo")).toBeInTheDocument();
    expect(screen.getByText("➡ Redo")).toBeInTheDocument();
    expect(screen.getByText("⚙️ Manage Custom Fields")).toBeInTheDocument();
    expect(screen.getByText("+ New Task")).toBeInTheDocument();
  });

  test("calls dispatch with UNDO action on undo button click", () => {
    renderHeader(["some past action"]);
    
    fireEvent.click(screen.getByText("⬅ Undo"));
    expect(mockDispatch).toHaveBeenCalledWith({ type: "UNDO" });
  });

  test("calls dispatch with REDO action on redo button click", () => {
    renderHeader([], ["some future action"]);
    
    fireEvent.click(screen.getByText("➡ Redo"));
    expect(mockDispatch).toHaveBeenCalledWith({ type: "REDO" });
  });

  test("calls onOpenTaskModal when New Task button is clicked", () => {
    renderHeader();
    
    fireEvent.click(screen.getByText("+ New Task"));
    expect(mockOnOpenTaskModal).toHaveBeenCalled();
  });

  test("calls onOpenCustomFieldsModal when Manage Custom Fields button is clicked", () => {
    renderHeader();
    
    fireEvent.click(screen.getByText("⚙️ Manage Custom Fields"));
    expect(mockOnOpenCustomFieldsModal).toHaveBeenCalled();
  });

  test("handles keyboard shortcuts correctly", () => {
    renderHeader(["some past action"], ["some future action"]);
    
    fireEvent.keyDown(document, { ctrlKey: true, key: "z" });
    expect(mockDispatch).toHaveBeenCalledWith({ type: "UNDO" });

    fireEvent.keyDown(document, { ctrlKey: true, key: "y" });
    expect(mockDispatch).toHaveBeenCalledWith({ type: "REDO" });
  });
});
