import { useEffect, useRef, useState } from "react";
import { FaBell } from "react-icons/fa";
import { socket } from "../socket/socket";
import { useNavigate } from "react-router-dom";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // fetch initial notifications
    fetch("http://localhost:3000/notifications/", { credentials: "include" })
      .then((r) => r.ok ? r.json() : [])
      .then((data) => {
        setNotifications(data || []);
      })
      .catch((err) => console.error(err));

    const handler = (notif: any) => {
      setNotifications((s) => [notif, ...s]);
    };

    socket.on("notification:received", handler);

    return () => {
      socket.off("notification:received", handler);
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const navigate = useNavigate();

  const handleNotificationClick = async (n: any) => {
    try {
      await markRead(n.id);
    } catch (err) {
      // ignore
    }

    setOpen(false);

    const auctionId = n.auction_id || n.auction?.id;
    if (auctionId) {
      navigate(`/auctiondetails/${auctionId}`);
    }
  };

  const markRead = async (id: string) => {
    try {
      await fetch(`http://localhost:3000/notifications/${id}/read`, {
        method: "PATCH",
        credentials: "include",
      });

      setNotifications((s) => s.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    } catch (err) {
      console.error(err);
    }
  };

  const markAll = async () => {
    try {
      await fetch("http://localhost:3000/notifications/read-all", {
        method: "PATCH",
        credentials: "include",
      });

      setNotifications((s) => s.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        className="relative rounded-full p-2 hover:bg-slate-100"
        onClick={() => setOpen(!open)}
        aria-label="Notifications"
      >
        <FaBell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 rounded-xl border bg-white shadow-lg z-50">
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <strong>Notifications</strong>
            <button className="text-sm text-slate-500" onClick={markAll}>Mark all read</button>
          </div>
          <div className="max-h-64 overflow-auto">
            {notifications.length === 0 && (
              <div className="p-4 text-sm text-slate-500">No notifications</div>
            )}

            {notifications.map((n) => (
              <div key={n.id} className={`p-3 cursor-pointer hover:bg-slate-50 ${n.is_read ? "opacity-70" : ""}`} onClick={() => handleNotificationClick(n)}>
                <div className="text-sm font-semibold">{n.type}</div>
                <div className="text-xs text-slate-600">{n.message}</div>
                <div className="text-xs text-slate-400">{new Date(n.created_at).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
