import { Outlet } from "react-router-dom";
import TopNavbar from "./TopNavbar";
import LeftSidebar from "./LeftSidebar";
import FavoriteWatcher from "../FavoriteWatcher";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {/* TOP NAVBAR */}
      <TopNavbar />
      <FavoriteWatcher />
      {/* GRID */}
      <div className="max-w-[1750px] mx-auto px-4 py-6 grid lg:grid-cols-[280px_1fr_280px] gap-6">
        {/* LEFT */}
        <LeftSidebar />

        {/* CENTER */}
        <Outlet />

      </div>
    </div>
  );
}