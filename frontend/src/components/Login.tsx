import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import LoadingModal from "./modals/LoadingModal";
import ErrorModal from "./modals/ErrorModal";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();
  const { user, login } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  const url = "http://localhost:3000/login"; //temporary url

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setIsError(false);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setIsError(true);
        return;
      }
      console.log("Login successful.");
      const userResponse = await fetchUser();

      login(userResponse);

      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUser = async () => {
    const response = await fetch("http://localhost:3000/login/user", {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }

    const data = await response.json();

    return data.user;
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-auth-gradient">
      <div className="absolute inset-x-0 top-0 h-40 bg-hdm-red/10 blur-3xl" />
      <div className="relative w-full max-w-md overflow-hidden rounded-[32px] border border-white/70 bg-white/95 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur-xl">
        <div className="mb-8 text-center">
          <img
            src="/src/assets/hdm-logo.svg"
            alt="HDM logo"
            className="mx-auto mb-6 h-16 w-16 object-contain"
          />
          <h1 className="text-3xl font-semibold text-slate-900">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-slate-500">Sign in to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {isError && <ErrorModal text="Invalid username or password" />}

          <label className="block space-y-2 text-sm">
            <span className="font-medium text-slate-700">Username</span>
            <input
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-hdm-red focus:ring-2 focus:ring-hdm-red/20"
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>

          <label className="block space-y-2 text-sm">
            <span className="font-medium text-slate-700">Password</span>
            <input
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-hdm-red focus:ring-2 focus:ring-hdm-red/20"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-full bg-hdm-red px-6 py-3 text-base font-semibold text-white shadow-lg shadow-hdm-red/20 transition hover:bg-carmine"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Enter your credentials to continue.
        </p>
      </div>

      {isLoading && <LoadingModal text="Signing in..." />}
    </div>
  );
}
