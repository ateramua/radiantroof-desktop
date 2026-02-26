"use client";
import { useState, useEffect } from "react";
import api from "../lib/api";

export default function UserForm({ userToEdit, onSave }) {
  const [form, setForm] = useState({ email: "", password: "", role: "user" });

  useEffect(() => {
    if (userToEdit) setForm(userToEdit);
  }, [userToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userToEdit) {
      await api.patch(`/users/${userToEdit.id}`, form);
    } else {
      await api.post("/users", form);
    }
    setForm({ email: "", password: "", role: "user" });
    onSave();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
      <input placeholder="Password" type="password" onChange={e => setForm({ ...form, password: e.target.value })} />
      <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit">{userToEdit ? "Update" : "Create"}</button>
    </form>
  );
}