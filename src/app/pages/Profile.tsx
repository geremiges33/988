import { useAuth } from "../context/AuthContext";

export function Profile() {
  const { user, logout } = useAuth();

  if (!user) {
    return <div>No user logged in</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Profile</h1>

      <p><b>Name:</b> {user.firstName} {user.lastName}</p>
      <p><b>Username:</b> {user.username}</p>
      <p><b>Email:</b> {user.email}</p>
      <p><b>Role:</b> {user.isAdmin ? "Admin" : "User"}</p>

      <button onClick={logout}>
        Logout
      </button>
    </div>
  );
}