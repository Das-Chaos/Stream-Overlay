import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users', {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users', error);
      }
    };
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(`/api/users/${userId}/role`, { role: newRole }, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setUsers(users.map(user => user._id === userId ? { ...user, role: newRole } : user));
    } catch (error) {
      console.error('Error updating role', error);
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                >
                  <option value="admin">Admin</option>
                  <option value="streamer">Streamer</option>
                  <option value="mod">Mod</option>
                  <option value="user">User</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
