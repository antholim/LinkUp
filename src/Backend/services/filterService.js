import User from "../models/user.js"; // Import user model

// Get the user's stored filter preferences from the database
const getUserFilters = async (userId) => {
    try {
        const user = await User.findById(userId);
        return user?.filters || []; // Return stored filters, or empty array if none exist
    } catch (error) {
        console.error("Error retrieving user filters:", error);
        throw error;
    }
};

// Update the user's selected filters in the database
const updateUserFilters = async (userId, newFilters) => {
    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { filters: newFilters }, 
            { new: true } // Return the updated user document
        );
        return user?.filters || []; // Return updated filters
    } catch (error) {
        console.error("Error updating user filters:", error);
        throw error;
    }
};

export const filterService = { getUserFilters, updateUserFilters };
