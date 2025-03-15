import { API_HOST } from "../../constants/API_HOST";
import axios from "axios";

export const login = async (username, password) => {
  const { data } = await axios.post(API_HOST + "/api/auth/login", {
    username: username,
    password: password,
  });
  if (data.status == 400)
    return { message: data.response.data.message, status: 400 };
  else {
    localStorage.setItem("token", data.token);
    return { message: "Success", status: 200 };
  }
};
export const reg = async (username, password) => {
  const { data } = await axios.post(API_HOST + "/api/auth/register", {
    username: username,
    password: password,
  });
  if (data.status == 400)
    return { message: data.response.data.message, status: 400 };
  else {
    return { message: "Success", status: 200 };
  }
};
