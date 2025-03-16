import { fetchingService } from "./fetchingService";

// Fetch the user's current AI filters
export const fetchUserFilters = async (accessToken) => {
  try {
    const response = await fetchingService.post("/get-user-filters", { accessToken });
    return response.filters || [];
  } catch (error) {
    console.error("Error fetching user filters:", error);
    return [];
  }
};

// Update the user's selected AI filters
export const updateUserFilters = async (accessToken, newFilters) => {
  try {
    const response = await fetchingService.post("/update-user-filters", { accessToken, filters: newFilters });
    return response.filters;
  } catch (error) {
    console.error("Error updating filters:", error);
  }
};
