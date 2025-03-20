import React from "react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import {
  Login,
  Register,
  ForgotPassword,
  VerfiyEmail,
  Profile,
  EditProfile,
  ChatPage,
  AlumniLocations,
  AboutUs,
  Error,
  UnverifiedUsers,
  Home,
} from "./pages";

import { Achievements, Opportunities, Layout } from "./components";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<Layout />}>
        {/* Protected routes */}
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/Achievements" element={<Achievements />} />
        <Route path="edit-profile/:profileId" element={<EditProfile />} />
        <Route path="profile/:profileId" element={<Profile />} />
        <Route path="/Opportunities" element={<Opportunities />} />
        <Route path="chats/:chatId" element={<ChatPage />} />
        <Route path="chats" element={<ChatPage />} />
        <Route path="/alumni-map" element={<AlumniLocations />} />
        <Route path="unverified-users" element={<UnverifiedUsers />} />

        {/* Public routes */}
        <Route path="about" element={<AboutUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="verify-email" element={<VerfiyEmail />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* error page */}
      <Route path="*" element={<Error />} />
    </>
  )
);

function App() {
  return (
    <div className="font-sans">
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        closeButton={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        theme="dark"
      />

      <RouterProvider router={router} />
    </div>
  );
}

export default App;
