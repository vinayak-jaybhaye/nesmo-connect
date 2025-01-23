import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import FileUpload from "./FileUpload";
import { Login, Register } from "./pages";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path="/" element={<FileUpload />} />
    <Route path="register" element={<Register />} />
    <Route path="login" element={<Login />} />
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
