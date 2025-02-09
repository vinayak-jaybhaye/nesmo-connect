import React from "react";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import {
  Login,
  Register,
  Dashboard,
  ForgotPassword,
  VerfiyEmail,
  Profile,
  EditProfile
} from "./pages";

import { UserList, GroupChat } from "./components";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Dashboard />} />
      <Route path="signup" element={<Register />} />
      <Route path="login" element={<Login />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="profile" element={<Profile />} />
      <Route path = 'edit-profile/:profileId' element = {<EditProfile />} />
      <Route path="profile/:profileId" element={<Profile />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="verify-email" element={<VerfiyEmail />} />
      <Route path= 'all-users' element = {<UserList />} />
      <Route path= 'group-chat' element = {<GroupChat />} />
    </>
  )
);

function App() {
  return (
    <div className="text-xl bg-blue-600">
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
