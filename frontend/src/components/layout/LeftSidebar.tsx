import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import { IoIosCreate } from "react-icons/io";
import { FaGavel, FaHouse } from "react-icons/fa6";
import { useAuth } from "../AuthProvider";

export default function LeftSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const location = useLocation();

  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <aside className="sticky top-6 min-h-[calc(100vh-48px)] h-fit bg-white rounded-3xl p-6 border">
      <img src="/src/assets/hdm-logo.svg" className="h-25 w-25 mx-auto" />

      <div className="mt-6 space-y-3">
        {isDashboard && (
          <>
            <button
              onClick={() => navigate("/")}
              className="w-full border py-3 rounded-2xl flex justify-center gap-2"
            >
              <FaHouse className="text-xl" />
              Home
            </button>

            <button
              onClick={() => navigate("/dashboard/auctions")}
              className="w-full bg-hdm-red text-white py-3 rounded-2xl flex justify-center gap-2"
            >
              <FaGavel className="text-xl" />
              All Auctions
            </button>
          </>
        )}

        {(user.role === "MITARBEITER" ||
          user.username === "aj049" ||
          user.username === "gb040") && (
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full bg-hdm-red text-white py-3 rounded-2xl flex justify-center gap-2"
          >
            <IoIosCreate className="text-xl" />
            Create auction
          </button>
        )}

        <button
          onClick={() => navigate("/mybids")}
          className="w-full bg-hdm-red text-white py-3 rounded-2xl flex items-center justify-center gap-2"
        >
          <FaGavel />
          Your bids
        </button>

        <button
          onClick={logout}
          className="w-full border py-3 rounded-2xl flex justify-center gap-2"
        >
          <MdLogout className="text-xl" />
          Logout
        </button>
      </div>
    </aside>
  );
}
