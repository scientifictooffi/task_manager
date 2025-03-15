import React from "react";
import { Routes, Route } from "react-router-dom";
import About from "../pages/About";
import App from "../pages/App";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Main from "../pages/Main";


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reg" element={<Register />} />
      <Route path="/main" element={<Main />} />

      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
};

export default AppRoutes;
