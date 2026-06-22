import { useAuth } from "../AuthProvider";
import NotificationBell from "../NotificationBell";
import { Navigate } from "react-router-dom";

export default function TopNavbar() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  };

  return (
    <header className="bg-white border-b p-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-bold text-hdm-red uppercase">
            Auction Platform
          </p>
          <h1 className="text-xl font-bold">Discover trending auctions</h1>
        </div>

        <div className="flex items-center gap-4">
          <NotificationBell />
          <div className="bg-slate-900 text-white px-4 py-2 rounded-2xl">
            Logged in as {user.username}
          </div>
        </div>
      </div>
    </header>
  );
}