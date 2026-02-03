import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";
import { useAuth } from "../auth/AuthContex";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const { user: authedUser } = useAuth();

  const navigate = useNavigate();
  useEffect(() => {
    const fetchUsers = async () => {
      try {
      const data = await apiFetch("/users");
      setUsers(data);
    } catch (err) {
      setError(err?.message || "Failed to load users");
      navigate("/");
    }
  };
    fetchUsers();
  }, [navigate]);

  const refreshUsers = async () => {
    try {
      const data = await apiFetch("/users");
      setUsers(data);
    } catch (err) {
      setError(err?.message || "Failed to refresh users");
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setActionMessage("");
    try {
      await apiFetch(`/users/${userId}/role`, {
        method: "PUT",
        body: JSON.stringify({ role: newRole }),
      });
      setActionMessage("Role updated");
      refreshUsers();
    } catch (err) {
      setError(err?.message || "Failed to update role");
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    setActionMessage("");
    try {
      await apiFetch(`/users/${userId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });
      setActionMessage(`User ${newStatus}`);
      refreshUsers();
    } catch (err) {
      setError(err?.message || "Failed to update status");
    }
  };

  const getStatus = (status) => (status ? status.toLowerCase() : "active");

  const groupUsersByStatus = (list) => ({
    active: list.filter((u) => getStatus(u.status) === "active"),
    banned: list.filter((u) => getStatus(u.status) === "banned"),
  });

  const groupedUsers = groupUsersByStatus(users);

  const renderUserSection = (title, list) => (
    <div key={title} className="post-section">
      <h2 className="section-title">{title}</h2>
      {list.length === 0 ? (
        <p className="muted">No {title.toLowerCase()} users.</p>
      ) : (
        <div className="cards-stack">
          {list.map((user) => {
            const status = getStatus(user.status);
            const selfIds = [authedUser?.id, authedUser?._id, authedUser?.userId].filter(Boolean);
            const isSelf = selfIds.includes(user._id);
            return (
              <div key={user._id} className="card-dark">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h3 className="card-title mb-0 line-clamp-1">{user.name}</h3>
                  <span className={`status-badge status-${status}`}>
                    {status.toUpperCase()}
                  </span>
                </div>
                <div className="card-body">
                  <p className="card-subtitle">Email: {user.email}</p>
                  <p className="card-text">Role: {user.role}</p>
                </div>
                <div className="card-footer">
                  <select
                    value={user.role}
                    disabled={isSelf}
                    onChange={(e) =>
                      setUsers((prev) =>
                        prev.map((u) =>
                          u._id === user._id ? { ...u, role: e.target.value } : u
                        )
                      )
                    }
                    style={{ minWidth: "140px", appearance: isSelf ? "none" : "auto", WebkitAppearance: isSelf ? "none" : "auto" }}
                    className={isSelf ? "select-disabled" : ""}
                  >
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </select>
                  {!isSelf && (
                    <button
                      onClick={() => handleRoleChange(user._id, user.role)}
                    >
                      Confirm
                    </button>
                  )}
                  {!isSelf && (
                    status === "active" ? (
                      <button
                        className="danger"
                        onClick={() => handleStatusChange(user._id, "banned")}
                      >
                        Ban
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(user._id, "active")}
                      >
                        Activate
                      </button>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <main className="page-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="hero-title">Users</h1>
          <p className="muted">Manage user roles and status.</p>
        </div>
      </section>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {actionMessage && <p style={{ color: "lightgreen" }}>{actionMessage}</p>}

      {users.length === 0 ? (
        <p className="muted">No users found.</p>
      ) : (
        <>
          {renderUserSection("Active", groupedUsers.active)}
          {renderUserSection("Banned", groupedUsers.banned)}
        </>
      )}
    </main>
  );
};

export default Users;
