import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CustomFieldHeader from "./custom-field-header";

describe("CustomFieldHeader", () => {
  const field = { name: "Priority" };
  const handleSort = jest.fn();
  const getSortIcon = jest.fn(() => <span data-testid="sort-icon">▲</span>);

  it("renders the field name", () => {
    render(
      <table>
        <thead>
          <tr>
            <CustomFieldHeader
              field={field}
              handleSort={handleSort}
              getSortIcon={getSortIcon}
            />
          </tr>
        </thead>
      </table>
    );

    expect(screen.getByText("Priority")).toBeInTheDocument();
  });

  it("calls handleSort when clicked", () => {
    render(
      <table>
        <thead>
          <tr>
            <CustomFieldHeader
              field={field}
              handleSort={handleSort}
              getSortIcon={getSortIcon}
            />
          </tr>
        </thead>
      </table>
    );

    fireEvent.click(screen.getByText("Priority"));

    expect(handleSort).toHaveBeenCalledTimes(1);
    expect(handleSort).toHaveBeenCalledWith("Priority");
  });
});
