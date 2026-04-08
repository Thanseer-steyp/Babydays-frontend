"use client";

import { useState } from "react";
import axiosInstance from "@/components/config/AxiosInstance";
import { useAuth } from "@/components/context/AuthContext";

export default function AuthPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPass, setShowPass] = useState(false);

  const addGmail = () => {
    if (!email.includes("@")) setEmail(email + "@gmail.com");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    try {
      const res = await axiosInstance.post("register/auth/", { email, password });
      const { access, refresh, username, email: userEmail } = res.data.data;
      login({ access, refresh, username, email: userEmail });
      setSuccess(res.data.message);
    } catch (err) {
      setError(
        err?.response?.data?.error ||
        err?.response?.data?.non_field_errors?.[0] ||
        "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        {/* Logo area */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
            <img src="/icons/logo.png" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">Welcome Back</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in or create a new account</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <div className="relative">
            <input
              type="email"
              placeholder="Email address"
              className="w-full px-4 py-3 pr-28 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-400 transition-colors text-gray-800 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={addGmail}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-600 font-semibold transition-colors"
            >
              @gmail.com
            </button>
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password (min 6 characters)"
              className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-400 transition-colors text-gray-800 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
            <button
              type="button"
              onClick={() => setShowPass((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Toggle password visibility"
            >
              {showPass ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
              <p className="text-sm text-green-700 font-medium">{success}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-xl font-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                Processing…
              </span>
            ) : "Continue"}
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-5">
          New users are automatically registered. Returning users are logged in.
        </p>
      </div>
    </div>
  );
}










// "use client";

// import { useState } from "react";
// import axiosInstance from "@/components/config/AxiosInstance";
// import { useAuth } from "@/components/context/AuthContext";

// export default function AuthPage() {
//   const { login } = useAuth();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const addGmail = () => {
//     if (!email.includes("@")) {
//       setEmail(email + "@gmail.com");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");
//     setLoading(true);

//     try {
//       // POST to /api/v1/register/auth/
//       const res = await axiosInstance.post("register/auth/", { email, password });

//       const { access, refresh, username, email: userEmail } = res.data.data;

//       // Store tokens + update AuthContext
//       login({ access, refresh, username, email: userEmail });

//       setSuccess(res.data.message);
//     } catch (err) {
//       setError(
//         err?.response?.data?.error ||
//           err?.response?.data?.non_field_errors?.[0] ||
//           "Invalid email or password"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 text-black">
//       <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
//         <h1 className="text-2xl font-bold text-center mb-6">Register</h1>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="relative">
//             <input
//               type="email"
//               placeholder="Email"
//               className="input w-full px-4 py-3 pr-28 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//             <button
//               type="button"
//               onClick={addGmail}
//               className="absolute right-2 top-1/2 -translate-y-1/2 text-sm px-3 py-1 rounded-md border bg-gray-100 hover:bg-gray-200"
//             >
//               @gmail.com
//             </button>
//           </div>

//           <input
//             type="password"
//             placeholder="Password"
//             className="input w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />

//           {error && <p className="text-sm text-red-500">{error}</p>}
//           {success && <p className="text-sm text-green-600">{success}</p>}

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
//           >
//             {loading ? "Processing..." : "Continue"}
//           </button>
//         </form>

//         <p className="text-xs text-gray-500 text-center mt-4">
//           Existing users will be logged in. New users will be automatically registered.
//         </p>
//       </div>
//     </div>
//   );
// }