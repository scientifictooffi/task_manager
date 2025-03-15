import { Link } from "react-router-dom";
import { reg } from "../api/apiAuth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/main");
  }, []);

  const onReg = async () => {
    const res = await reg(userName, password);
    console.log(res);

    if (res.status !== 200) {
      alert(res.message);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="flex border w-1/3 border-solid py-10 p-5 rounded-md">
        <div className="w-full">
          <p className="w-full flex justify-center font-medium text-lg">
            Register
          </p>
          <div className="text-gray-500 my-4 flex justify-between items-center">
            <svg
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
            <input
              onChange={(e) => setUserName(e.target.value)}
              type="text"
              className="w-full  ml-2 p-1.5 bg-white border border-solid border-gray-400 rounded-sm border-x"
              placeholder="Username"
            ></input>
          </div>
          <div className="text-gray-500 flex justify-between items-center">
            <svg
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
              />
            </svg>

            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="w-full ml-2 p-1.5 bg-white border border-solid border-gray-400 rounded-sm border-x"
              placeholder="Password"
            ></input>
          </div>
          <button
            onClick={onReg}
            className="bg-blue-600 text-white rounded text-sm w-full py-1 mt-5"
          >
            REGISTER
          </button>
          <div className="flex justify-center mt-2">
            <p>Have an account?</p>
            <Link to="/login">
              <p className="ml-1 font-link underline font-normal">Login</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
