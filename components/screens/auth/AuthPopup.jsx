import axiosPrivate from "@/components/config/AxiosPrivate";
import axiosPublic from "@/components/config/AxiosPublic";
import { useAuth } from "@/components/context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";

export default function AuthPopup({ onSuccess }) {
  const { login } = useAuth();

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center gap-4">
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            try {
              await axiosPublic.post(
                "register/google-login/",
                {
                  token: credentialResponse.credential,
                },
                {
                  withCredentials: true, // 🔥 MUST
                },
              );

              await login();

              // small delay to ensure state update
              setTimeout(() => {
                if (onSuccess) onSuccess();
              }, 100);
            } catch (err) {
              console.error(err);
            }
          }}
          onError={() => console.log("Login Failed")}
        />
      </div>
    </div>
  );
}
