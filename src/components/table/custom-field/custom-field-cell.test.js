import React from "react"; 
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CustomFieldCell from "./custom-field-cell";

describe("CustomFieldCell Component", () => {
  const renderInTable = (component) =>
    render(
      <table>
        <tbody>
          <tr>{component}</tr>
        </tbody>
      </table>
    );

  test("renders text custom field value", () => {
    const field = { name: "Due Date", type: "text" };
    const task = { customFields: { "Due Date": "2025-03-01" } };
    
    renderInTable(<CustomFieldCell field={field} task={task} />);
    
    expect(screen.getByText("2025-03-01")).toBeInTheDocument();
  });

  test("renders checkbox as checked if field is true", () => {
    const field = { name: "Completed", type: "checkbox" };
    const task = { customFields: { "Completed": true } };
    
    renderInTable(<CustomFieldCell field={field} task={task} />);
    
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  test("renders checkbox as unchecked if field is false", () => {
    const field = { name: "Completed", type: "checkbox" };
    const task = { customFields: { "Completed": false } };
    
    renderInTable(<CustomFieldCell field={field} task={task} />);
    
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  test("renders N/A if field value is missing", () => {
    const field = { name: "Assignee", type: "text" };
    const task = { customFields: {} };
    
    renderInTable(<CustomFieldCell field={field} task={task} />);
    
    expect(screen.getByText("N/A")).toBeInTheDocument();
  });
});
