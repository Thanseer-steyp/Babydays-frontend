import axios from "axios";


const apiURL = "http://localhost:8000/api/v1/";
const mediaURL = "http://localhost:8000/";


const axiosPrivate = axios.create({
  baseURL: apiURL,
  withCredentials: true,
});

export const mediaBaseURL = mediaURL;

export default axiosPrivate;