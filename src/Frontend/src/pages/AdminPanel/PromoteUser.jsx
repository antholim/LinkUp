import React, { useEffect, useState } from "react";
import { fetchingService } from "../../services/fetchingService"; // Fetching service for API calls
import { useAuth } from "../../components/AuthContext";

function PromoteUser() {
  const { user } = useAuth(); // Get logged-in user from context
  const [users, setUsers] = useState([]); // State to store users
  const [selectedUser, setSelectedUser] = useState(""); // Selected user to promote
  const [success, setSuccess] = useState(""); // Success message
  const [error, setError] = useState(""); // Error message

  // Fetch all users who are not admins
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetchingService.get("/get-all-user", {
          accessToken: localStorage.getItem("accessToken"),
        });
        setUsers(response || []);
      } catch (err) {
        setError("Failed to load users.", err);
        console.log(err)
      }
    };
    fetchUsers();
  }, []);

  // Handle the promotion of the user to admin
  const handlePromote = async () => {
    if (!selectedUser) return; // Check if a user is selected

    try {
      const response = await fetchingService.patch("/promote-user", {
        accessToken: localStorage.getItem("accessToken"),
        _id: selectedUser, // Send the selected user's ID to promote
      });
      if (response.status === 200) {
        setSuccess("User promoted successfully.");
        setError(""); // Clear any previous error
      } else {
        setError(response.message || "Promotion failed.");
        setSuccess("");
      }
    } catch (err) {
      setError("An error occurred while promoting.", err);
    }
  };

  // If the logged-in user is not an admin, display a message
  if (user?.role !== "admin") {
    return <p>You do not have permission to promote users.</p>;
  }

  return (
    <div>
      <h3>Promote User to Admin</h3>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
        <option value="">Select a user</option>
        {users
          .filter((u) => u.role !== "admin") // Filter out already admin users
          .map((u) => (
            <option key={u._id} value={u._id}>
              {u.username} ({u.email})
            </option>
          ))}
      </select>


      <button onClick={handlePromote} disabled={!selectedUser}>
        Promote
      </button>
    </div>
  );
}

export default PromoteUser;
