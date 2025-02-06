import userAuth from "../firebase/firebaseAuth";
import dbServices from "../firebase/firebaseDb";
import { login } from "../store/authSlice";
import { useDispatch } from "react-redux";





const dispatch = useDispatch();

const syncData = userAuth.auth.onAuthStateChanged(
    async (firebaseUser) => {
        if (firebaseUser) {
            try {
                const user = await dbServices.getDocument(
                    "users",
                    firebaseUser.uid
                );

                const {
                    avatarFileId,
                    coverFileId,
                    avatarUrl,
                    coverUrl,
                    email,
                    name,
                    userRole,
                } = user;
                const userData = {
                    uid: firebaseUser.uid,
                    avatarFileId,
                    coverFileId,
                    avatarUrl,
                    coverUrl,
                    email,
                    name,
                    userRole,
                };
                // console.log(userData)
                dispatch(login({ userData: userData }));
            } catch (error) {
                console.error("Error fetching user data:", error);
                navigate("/login");
            }
        } else {
            navigate("/login");
        }
    }
);


export { syncData };