import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CustomFieldsModal from "./fields-modal";
import AppContext from "../../context";

describe("CustomFieldsModal Component", () => {
  const mockDispatch = jest.fn();
  const mockOnClose = jest.fn();

  const renderModal = (isOpen, customFields = []) => {
    render(
      <AppContext.Provider
        value={{
          customFields,
          dispatch: mockDispatch,
          ACTIONS: { ADD_CUSTOM_FIELD: "ADD_CUSTOM_FIELD", REMOVE_CUSTOM_FIELD: "REMOVE_CUSTOM_FIELD" },
        }}
      >
        <CustomFieldsModal isOpen={isOpen} onClose={mockOnClose} />
      </AppContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("does not render when isOpen is false", () => {
    renderModal(false);
    expect(screen.queryByText("Manage Custom Fields")).not.toBeInTheDocument();
  });

  test("renders correctly when isOpen is true", () => {
    renderModal(true);
    expect(screen.getByText("Manage Custom Fields")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Field name")).toBeInTheDocument();
    expect(screen.getByText("Add Field")).toBeInTheDocument();
  });

  test("calls dispatch to add a custom field", () => {
    renderModal(true);
    
    fireEvent.change(screen.getByPlaceholderText("Field name"), { target: { value: "Test Field" } });
    fireEvent.click(screen.getByText("Add Field"));
    
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "ADD_CUSTOM_FIELD",
      payload: { name: "Test Field", type: "text" },
    });
  });

  test("shows error when adding duplicate field name", () => {
    renderModal(true, [{ name: "Test Field", type: "text" }]);
    
    fireEvent.change(screen.getByPlaceholderText("Field name"), { target: { value: "Test Field" } });
    fireEvent.click(screen.getByText("Add Field"));
    
    expect(screen.getByText("Invalid or duplicate field name!")).toBeInTheDocument();
  });

  test("calls dispatch to remove a custom field", () => {
    renderModal(true, [{ name: "Test Field", type: "text" }]);
    
    fireEvent.click(screen.getByText("❌"));
    
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "REMOVE_CUSTOM_FIELD",
      payload: "Test Field",
    });
  });

  test("calls onClose when Close button is clicked", () => {
    renderModal(true);
    
    fireEvent.click(screen.getByText("Close"));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
