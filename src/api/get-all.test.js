import { fetchData } from "./get-all"; // Adjust the path if needed

// Mock `localStorage`
beforeEach(() => {
  Object.defineProperty(global, "localStorage", {
    value: {
      getItem: jest.fn(),
      setItem: jest.fn(),
    },
    writable: true,
  });

  global.fetch = jest.fn(); // Mock fetch globally
});

afterEach(() => {
  jest.restoreAllMocks(); // Ensure all mocks are reset
});

describe("fetchData", () => {
  it("should return data from localStorage if available", async () => {
    const mockData = [{ id: 1, title: "Local Task" }];
    localStorage.getItem.mockReturnValue(JSON.stringify(mockData));

    const data = await fetchData();

    expect(localStorage.getItem).toHaveBeenCalledWith("tasks");
    expect(data).toEqual(mockData);
    expect(fetch).not.toHaveBeenCalled(); // Ensure fetch is NOT called
  });

  it("should fetch data from API if localStorage is empty", async () => {
    localStorage.getItem.mockReturnValue(null); // No local storage data

    const mockApiData = [{ id: 2, title: "API Task" }];
    fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockApiData),
    });

    const data = await fetchData();

    expect(fetch).toHaveBeenCalledWith((process.env.PUBLIC_URL || "") + "/data.json");
    expect(localStorage.setItem).toHaveBeenCalledWith("tasks", JSON.stringify(mockApiData));
    expect(data).toEqual(mockApiData);
  });

  it("should return null if API response is not ok", async () => {
    localStorage.getItem.mockReturnValue(null); // No local storage data

    fetch.mockResolvedValue({
      ok: false,
    });

    const data = await fetchData();

    expect(fetch).toHaveBeenCalledWith((process.env.PUBLIC_URL || "") + "/data.json");
    expect(data).toBeNull();
  });

  it("should return null and log an error if fetch fails", async () => {
    localStorage.getItem.mockReturnValue(null); // No local storage data
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {}); // Prevent console output in test logs

    fetch.mockRejectedValue(new Error("Network Error"));

    const data = await fetchData();

    expect(fetch).toHaveBeenCalledWith((process.env.PUBLIC_URL || "") + "/data.json");
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error loading data:",
      expect.any(Error)
    );
    expect(data).toBeNull();

    consoleErrorSpy.mockRestore(); // Restore console.error after test
  });
});
