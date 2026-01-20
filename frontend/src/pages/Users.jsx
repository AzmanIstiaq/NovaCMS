import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await apiFetch("/users");
        setUsers(data);
      } catch (err) {
        setError(err);
        navigate("/");
      }
    };
    fetchUsers();
  }, [navigate]);

  return (
    <main className="container">
      <h2>Users</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        users.map((user) => (
          <div
            key={user._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <p>
              <strong>{user.name}</strong>
            </p>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
            <p>Status: {user.status}</p>
          </div>
        ))
      )}
    </main>
  );
};

export default Users;
