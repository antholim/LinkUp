import { useEffect, useState } from "react";
import { fetchUserFilters, updateUserFilters } from "../../services/filterService";
import "./AIPage.css";

const FILTER_OPTIONS = ["toxic", "severe_toxic", "obscene", "threat", "insult", "identity_hate"];

const AIComponent = ({ accessToken }) => {
    const [selectedFilters, setSelectedFilters] = useState([]);

    useEffect(() => {
        if (!accessToken) return;

        const loadFilters = async () => {
            try {
                const filters = await fetchUserFilters(accessToken);
                setSelectedFilters(filters);
            } catch (error) {
                console.error("Failed to load filters:", error);
            }
        };

        loadFilters();
    }, [accessToken]);

    const handleFilterChange = (filter) => {
        setSelectedFilters((prev) =>
            prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
        );
    };

    const saveFilters = async () => {
        try {
            await updateUserFilters(accessToken, selectedFilters);
            alert("Filters updated successfully!");
        } catch (error) {
            console.error("Failed to update filters:", error);
        }
    };

    return (
        <div className="ai-container">
            <h2>AI Message Filtering</h2>
            <p>Select which categories you want to filter out from messages:</p>
            <div className="filter-options">
                {FILTER_OPTIONS.map((filter) => (
                    <label key={filter} className="filter-label">
                        <input
                            type="checkbox"
                            checked={selectedFilters.includes(filter)}
                            onChange={() => handleFilterChange(filter)}
                        />
                        {filter.replace("_", " ")}
                    </label>
                ))}
            </div>
            <button className="save-button" onClick={saveFilters}>
                Save Filters
            </button>
        </div>
    );
};

export default AIComponent;
