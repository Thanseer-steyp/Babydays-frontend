import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

export default function Login() {

  const handleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;

    try {
      const res = await axios.post("http://localhost:8000/api/v1/register/google-login/", {
        token: token,
      });

      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.log("Login Failed")}
      />
    </div>
  );
}