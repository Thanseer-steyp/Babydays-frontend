import axiosPublic from "@/components/config/AxiosPublic";
import { useAuth } from "@/components/context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";

export default function AuthPopup({ onSuccess, onClose }) {
  const { login } = useAuth();

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.45)" }}
    >
      <div
        className="relative flex flex-col"
        style={{
          background: "var(--color-bg, #fff)",
          borderRadius: "16px",
          border: "0.5px solid rgba(0,0,0,0.1)",
          padding: "2rem 2rem 1.75rem",
          width: "340px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "14px",
            right: "14px",
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            border: "0.5px solid rgba(0,0,0,0.15)",
            background: "transparent",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#888",
            fontSize: "14px",
            lineHeight: 1,
          }}
        >
          ✕
        </button>

        {/* Header */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              background: "#f5f5f5",
              border: "0.5px solid rgba(0,0,0,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1rem",
            }} className="mx-auto"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
                fill="#666"
              />
            </svg>
          </div>
          <p
            style={{
              fontSize: "17px",
              fontWeight: 500,
              color: "#111",
              margin: "0 0 4px",
            }} className="text-center"
          >
            Sign in to continue
          </p>
          <p
            style={{
              fontSize: "13px",
              color: "#666",
              margin: 0,
              lineHeight: 1.5,
            }} className="text-center"
          >
            Connect your account to save progress and access all features.
          </p>
        </div>

        {/* Google Login */}
        <div style={{ marginBottom: "1rem" }}>
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                await axiosPublic.post(
                  "register/google-login/",
                  { token: credentialResponse.credential },
                  { withCredentials: true }
                );
                await login();
                setTimeout(() => {
                  if (onSuccess) onSuccess();
                }, 100);
              } catch (err) {
                console.error(err);
              }
            }}
            onError={() => console.log("Login Failed")}
            theme="outline"
            size="large"
            shape="rectangular"
            text="continue_with"
          />
        </div>

        {/* Divider */}
        {/* <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{ flex: 1, height: "0.5px", background: "rgba(0,0,0,0.1)" }}
          />
          <span style={{ fontSize: "12px", color: "#aaa" }}>or</span>
          <div
            style={{ flex: 1, height: "0.5px", background: "rgba(0,0,0,0.1)" }}
          />
        </div> */}

        {/* Email fallback */}
        {/* <button
          style={{
            width: "100%",
            height: "40px",
            background: "#fff",
            border: "0.5px solid rgba(0,0,0,0.15)",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            color: "#111",
            fontWeight: 500,
          }}
        >
          Continue with email
        </button> */}

        {/* Footer */}
        <p
          style={{
            margin: "1.25rem 0 0",
            fontSize: "11px",
            color: "#aaa",
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          By continuing, you agree to our{" "}
          <span style={{ color: "#666", textDecoration: "underline", cursor: "pointer" }}>
            Terms of Service
          </span>{" "}
          and{" "}
          <span style={{ color: "#666", textDecoration: "underline", cursor: "pointer" }}>
            Privacy Policy
          </span>
          .
        </p>
      </div>
    </div>
  );
}