"use client";
import Protected from "../../components/Protected";
import { useState, useEffect } from "react";
import api from "../../lib/api";
import UserForm from "../../components/UserForm";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);

  const fetchUsers = async () => {
    const res = await api.get("/users");
    setUsers(res.data);
  };

  const handleDelete = async (id) => {
    if (confirm("Delete user?")) {
      await api.delete(`/users/${id}`);
      fetchUsers();
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  return (
    <Protected role="admin">
      <h1>Admin Panel</h1>
      <UserForm onSave={fetchUsers} userToEdit={editUser} />
      <ul>
        {users.map(u => (
          <li key={u.id}>
            {u.email} ({u.role})
            <button onClick={() => setEditUser(u)}>Edit</button>
            <button onClick={() => handleDelete(u.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </Protected>
  );
}