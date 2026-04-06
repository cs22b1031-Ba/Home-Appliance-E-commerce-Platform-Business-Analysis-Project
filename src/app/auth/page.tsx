"use client";

import { FormEvent, useState } from "react";

type Mode = "login" | "signup";

const emptySignup = {
  phone: "",
  email: "",
  password: "",
  name: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
};

const emptyLogin = {
  phone: "",
  password: "",
};

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [signup, setSignup] = useState(emptySignup);
  const [login, setLogin] = useState(emptyLogin);
  const [status, setStatus] = useState("");

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("Signing in...");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(login),
    });
    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      setStatus(payload.message ?? "Login failed.");
      return;
    }
    window.location.href = "/account";
  };

  const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("Creating account...");
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signup),
    });
    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      setStatus(payload.message ?? "Signup failed.");
      return;
    }
    window.location.href = "/account";
  };

  return (
    <main className="mx-auto max-w-4xl px-6 pb-24 pt-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold">Account</h1>
          <p className="mt-2 text-sm text-[var(--umber)]">
            Sign in with your phone number or create a new account.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`rounded-full px-5 py-2 text-sm font-semibold ${
              mode === "login"
                ? "bg-[var(--ink)] text-white"
                : "border border-[rgba(90,70,52,0.3)] text-[var(--umber)]"
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`rounded-full px-5 py-2 text-sm font-semibold ${
              mode === "signup"
                ? "bg-[var(--ink)] text-white"
                : "border border-[rgba(90,70,52,0.3)] text-[var(--umber)]"
            }`}
          >
            Create account
          </button>
        </div>
      </div>

      {mode === "login" ? (
        <form
          onSubmit={handleLogin}
          className="mt-8 space-y-4 rounded-3xl border border-white/60 bg-white/70 p-8"
        >
          <label className="flex flex-col gap-2 text-sm">
            Phone number
            <input
              required
              value={login.phone}
              onChange={(event) =>
                setLogin((prev) => ({ ...prev, phone: event.target.value }))
              }
              placeholder="e.g. 9876543210"
              className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            Password
            <input
              required
              type="password"
              value={login.password}
              onChange={(event) =>
                setLogin((prev) => ({ ...prev, password: event.target.value }))
              }
              className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
            />
          </label>
          <button
            type="submit"
            className="rounded-full bg-[var(--ink)] px-6 py-3 text-sm font-semibold text-white"
          >
            Sign in
          </button>
          {status ? <p className="text-sm text-[var(--umber)]">{status}</p> : null}
        </form>
      ) : (
        <form
          onSubmit={handleSignup}
          className="mt-8 space-y-4 rounded-3xl border border-white/60 bg-white/70 p-8"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm">
              Phone number
              <input
                required
                value={signup.phone}
                onChange={(event) =>
                  setSignup((prev) => ({ ...prev, phone: event.target.value }))
                }
                placeholder="e.g. 9876543210"
                className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              Email
              <input
                required
                type="email"
                value={signup.email}
                onChange={(event) =>
                  setSignup((prev) => ({ ...prev, email: event.target.value }))
                }
                className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
              />
            </label>
          </div>
          <label className="flex flex-col gap-2 text-sm">
            Password
            <input
              required
              type="password"
              value={signup.password}
              onChange={(event) =>
                setSignup((prev) => ({ ...prev, password: event.target.value }))
              }
              className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            Full name (optional)
            <input
              value={signup.name}
              onChange={(event) =>
                setSignup((prev) => ({ ...prev, name: event.target.value }))
              }
              className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            Address
            <input
              required
              value={signup.address}
              onChange={(event) =>
                setSignup((prev) => ({ ...prev, address: event.target.value }))
              }
              className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
            />
          </label>
          <div className="grid gap-4 md:grid-cols-3">
            <label className="flex flex-col gap-2 text-sm">
              City
              <input
                required
                value={signup.city}
                onChange={(event) =>
                  setSignup((prev) => ({ ...prev, city: event.target.value }))
                }
                className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              State
              <input
                required
                value={signup.state}
                onChange={(event) =>
                  setSignup((prev) => ({ ...prev, state: event.target.value }))
                }
                className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              Postal code
              <input
                required
                value={signup.postalCode}
                onChange={(event) =>
                  setSignup((prev) => ({
                    ...prev,
                    postalCode: event.target.value,
                  }))
                }
                className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
              />
            </label>
          </div>
          <button
            type="submit"
            className="rounded-full bg-[var(--ink)] px-6 py-3 text-sm font-semibold text-white"
          >
            Create account
          </button>
          {status ? <p className="text-sm text-[var(--umber)]">{status}</p> : null}
        </form>
      )}
    </main>
  );
}
