import axios from "axios";


const apiURL = "http://localhost:8000/api/v1/";
const mediaURL = "http://localhost:8000/";


const axiosPublic = axios.create({
  baseURL: apiURL,
});

export const mediaBaseURL = mediaURL;

export default axiosPublic;