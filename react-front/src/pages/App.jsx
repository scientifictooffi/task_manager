import { useState } from "react";
import reactLogo from "../assets/react.svg";
import "../App.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/main");
  }, []);
  return (
    <div className="flex items-center h-full w-full justify-center">
      <div>
        <div className="flex justify-center w-full text-2xl font-bold">
          Task Manager
        </div>
        <div className="flex justify-center w-full my-3">Start now</div>
        <div className="w-full flex justify-between">
          <Link className="w-full bg-blue-500 text-white mr-3" to="/login">
            <button className="w-full bg-blue-500 text-white mr-3">
              LOGIN
            </button>
          </Link>
          <Link className="w-full bg-gray-700 text-white" to="/reg">
            <button className="w-full bg-gray-700 text-white">REGISTER</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default App;
