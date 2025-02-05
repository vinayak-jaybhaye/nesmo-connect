import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import { Login, Register, Dashboard, ForgotPassword, VerfiyEmail, Profile} from "./pages";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path="/" element={<Dashboard />} />
    <Route path="signup" element={<Register />} />
    <Route path="login" element={<Login />} />
    <Route path = "dashboard" element = {<Dashboard />} />
    <Route path = "profile" element = {<Profile />} />
    <Route path = "forgot-password" element = {<ForgotPassword />} /> 
    <Route path = "verify-email" element = {<VerfiyEmail />} />
    </>
  )
);

function App() {
  return (
    <div className="text-xl bg-blue-600">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
