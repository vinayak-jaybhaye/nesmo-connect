import React from "react";

function Profile() {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex h-[40vh]">
        <img src="/cat.jpeg" className="w-[100%]" />
      </div>
      <div className="h-[60vh] relative">
        <div className="flex relative justify-end h-[40%]">
          {/* <div className="h-[300px] w-[300px] bg-pink-500"></div> */}
          <div className="absolute rounded-full h-[300px] w-[300px] -top-36 left-20">
            <img
              src="/dog.jpeg"
              className="rounded-full w-full h-full object-cover"
            />
          </div>

          <div className="bg-red-300 flex w-[65%] justify-between p-5">
            <div className="bg-yellow-300 w-[70%]">
              <div>LIONEL MESSI</div>
              <div className="flex justify-around">
                <div>Role</div>
                <div>Connect+</div>
              </div>
              <div className="display flex justify-around">
                <div>linkedin</div>
                <div>email</div>
                <div>twitter</div>
              </div>
            </div>
            <div className="bg-violet-400 w-[30%]">edit</div>
          </div>
        </div>
        <div className="h-[60%] bg-red-700 flex flex-col justify-evenly">
          <div className="flex justify-around">
            <div>
              <div>Education</div>
              <div>City</div>
            </div>
            <div>
              Job and position
            </div>
          </div>
          <div>About</div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
