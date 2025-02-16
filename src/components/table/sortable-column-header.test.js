import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SortableColumnHeader from "./sortable-column-header";

describe("SortableColumnHeader", () => {
  const col = "priority";
  const handleSort = jest.fn();
  const getSortIcon = jest.fn(() => <span data-testid="sort-icon">▲</span>);

  it("renders the column name with the first letter capitalized", () => {
    render(
      <table>
        <thead>
          <tr>
            <SortableColumnHeader
              col={col}
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
            <SortableColumnHeader
              col={col}
              handleSort={handleSort}
              getSortIcon={getSortIcon}
            />
          </tr>
        </thead>
      </table>
    );

    fireEvent.click(screen.getByText("Priority"));

    expect(handleSort).toHaveBeenCalledTimes(1);
    expect(handleSort).toHaveBeenCalledWith(col);
  });
});
