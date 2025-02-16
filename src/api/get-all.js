export const fetchData = async () => {
  try {
    const localData = localStorage.getItem("tasks");
    if (localData) return JSON.parse(localData);

    const response = await fetch(process.env.PUBLIC_URL + "/data.json");

    if (!response.ok) throw new Error("Failed to fetch data");

    const jsonData = await response.json();
    localStorage.setItem("tasks", JSON.stringify(jsonData));
    return jsonData || [];
  } catch (error) {
    console.error("Error loading data:", error);
    return null;
  }
};
