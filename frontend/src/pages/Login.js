import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Rocket, ShieldCheck } from "lucide-react";
import { API_BASE_URL } from "../config";

const GOOGLE_CLIENT_ID =
  process.env.REACT_APP_GOOGLE_CLIENT_ID ||
  "1024659991752-456qie5vacr11tnqh42rt92hmrtfimur.apps.googleusercontent.com";

const GOOGLE_SCRIPT_ID = "google-identity-services";

function loadGoogleIdentityScript() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }

    const existingScript = document.getElementById(GOOGLE_SCRIPT_ID);
    if (existingScript) {
      existingScript.addEventListener("load", resolve, { once: true });
      existingScript.addEventListener("error", reject, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_SCRIPT_ID;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

const Login = () => {
  const googleButtonRef = useRef(null);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const handleGoogleCredential = useCallback(async (response) => {
    if (!response?.credential) {
      setMessage("Google did not return a sign-in credential.");
      setMessageType("error");
      return;
    }

    setMessage("Verifying your Google sign-in...");
    setMessageType("info");

    try {
      const result = await fetch(`${API_BASE_URL}/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          credential: response.credential,
        }),
      });

      const data = await result.json().catch(() => ({}));

      if (!result.ok) {
        throw new Error(data.message || data.detail || "Google sign-in could not be verified.");
      }

      setMessage("Signed in successfully. Redirecting...");
      setMessageType("success");
      navigate(data.redirectUrl || "/modules");
    } catch (error) {
      setMessage(error.message || "Google sign-in failed.");
      setMessageType("error");
    }
  }, [navigate]);

  useEffect(() => {
    let isMounted = true;

    async function initialiseGoogleLogin() {
      try {
        await loadGoogleIdentityScript();

        if (!isMounted || !googleButtonRef.current) {
          return;
        }

        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCredential,
          auto_select: false,
          cancel_on_tap_outside: true,
          ux_mode: "popup",
        });

        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: "outline",
          size: "large",
          type: "standard",
          shape: "rectangular",
          text: "signin_with",
          width: 360,
        });
      } catch (_error) {
        if (isMounted) {
          setMessage("Google sign-in could not load. Please refresh and try again.");
          setMessageType("error");
        }
      }
    }

    initialiseGoogleLogin();

    return () => {
      isMounted = false;
    };
  }, [handleGoogleCredential]);

  return (
    <main className="min-h-screen bg-slate-50 pt-24">
      <section className="container mx-auto grid min-h-[calc(100vh-6rem)] max-w-6xl grid-cols-1 items-center gap-10 px-4 py-10 lg:grid-cols-[1.05fr_460px]">
        <div className="space-y-8">
          <Link to="/" className="inline-flex items-center gap-2 text-xl font-bold text-slate-950">
            <Rocket className="h-7 w-7 text-blue-600" />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Xprep
            </span>
          </Link>

          <div className="max-w-2xl space-y-5">
            <p className="text-sm font-bold uppercase tracking-wider text-blue-600">Client Portal</p>
            <h1 className="text-4xl font-extrabold leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Sign in to manage your Xprep workspace.
            </h1>
            <p className="text-lg leading-8 text-slate-600">
              Secure account access for mock interviews, resume tools, job search workflows, and learning modules.
            </p>
          </div>

          <div className="grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="font-semibold text-slate-950">Google OAuth</p>
              <p className="mt-1 text-sm text-slate-500">Verified identity flow</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="font-semibold text-slate-950">Session Ready</p>
              <p className="mt-1 text-sm text-slate-500">Backend token handoff</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
          <div className="mb-6">
            <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold uppercase tracking-wider text-blue-600">Welcome Back</p>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-950">Log in</h2>
          </div>

          {message && (
            <div
              className={`mb-5 rounded-lg border px-4 py-3 text-sm ${
                messageType === "error"
                  ? "border-red-200 bg-red-50 text-red-700"
                  : messageType === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 bg-slate-50 text-slate-600"
              }`}
              role="status"
              aria-live="polite"
            >
              {message}
            </div>
          )}

          <div ref={googleButtonRef} className="flex min-h-11 justify-center" />

          <div className="my-6 flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-slate-400">
            <span className="h-px flex-1 bg-slate-200" />
            or
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <form className="space-y-4" action={`${API_BASE_URL}/login`} method="post">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="h-11 w-full rounded-lg border border-slate-300 px-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                placeholder="name@company.com"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className="h-11 w-full rounded-lg border border-slate-300 px-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                placeholder="Enter password"
                required
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <label className="inline-flex items-center gap-2 font-medium text-slate-600">
                <input type="checkbox" name="remember" className="h-4 w-4 accent-blue-600" />
                Remember me
              </label>
              <Link className="font-semibold text-blue-600 hover:underline" to="/forgot-password">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="h-11 w-full rounded-lg bg-blue-600 font-bold text-white transition hover:bg-blue-700"
            >
              Sign in
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            New to Xprep?{" "}
            <Link className="font-semibold text-blue-600 hover:underline" to="/modules">
              Explore modules
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Login;
