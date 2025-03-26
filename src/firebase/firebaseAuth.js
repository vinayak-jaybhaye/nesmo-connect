import {
    createUserWithEmailAndPassword,
    setPersistence,
    browserLocalPersistence,
    sendEmailVerification,
    fetchSignInMethodsForEmail,
    updatePassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    signInWithPopup,
    GoogleAuthProvider
} from "firebase/auth";

import { serverTimestamp, doc, getDoc, updateDoc, setDoc } from "firebase/firestore";

import app from './firebaseConfig.js'
import { getAuth } from "firebase/auth";
import dbServices from './firebaseDb.js'

class Auth {
    auth;
    googleProvider;
    constructor() {
        this.auth = getAuth(app)
        this.auth.setPersistence(browserLocalPersistence);
        this.googleProvider = new GoogleAuthProvider();
    }

    // Register new user
    async register(email, password, name, location) {
        try {
            const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
            const user = userCredential.user;
            // console.log("User registered:", user.uid, user.email);
            await dbServices.addDocument("pendingUsers", user.uid, {
                email: user.email,
                name: name,
                emailVerified: user.emailVerified,
                avatarUrl: "",
                avatarFileId: "",
                coverFileId: "",
                coverUrl: "",
                personalData: {
                    location: location,
                },
                createdAt: serverTimestamp()
            });
            await this.sendVerificationEmail()
            return user;
        } catch (error) {
            console.error("Firebase Auth : register() ::", error.message);
            throw error;
        }
    };

    async signInWithGoogle(location) {
        try {
            this.googleProvider.setCustomParameters({ prompt: "select_account" });

            const result = await signInWithPopup(this.auth, this.googleProvider);
            const googleUser = result.user;
            // console.log("Google Login Successful:", googleUser);

            const userRef = doc(dbServices.db, "users", googleUser.uid);
            const pendingUserRef = doc(dbServices.db, "pendingUsers", googleUser.uid);

            // Check if user exists
            const existingUser = await getDoc(userRef);
            const existingPendingUser = await getDoc(pendingUserRef);

            // Get email credential to link accounts
            const credential = GoogleAuthProvider.credentialFromResult(result);

            if (existingUser.exists()) {
                // Check if the user previously signed in with email/password
                const currentUser = this.auth.currentUser;
                const signInMethods = await fetchSignInMethodsForEmail(this.auth, googleUser.email);

                if (signInMethods.includes("password")) {
                    try {
                        // Link Google sign-in to the email/password account
                        if (currentUser) {
                            await linkWithCredential(currentUser, credential);
                            console.log("Google account linked with email/password.");
                        }
                    } catch (linkError) {
                        console.error("Error linking Google account:", linkError.message);
                    }
                }

                // Update user location and avatar
                await updateDoc(userRef, {
                    "personalData.location": location,
                    avatarUrl: existingUser.data().avatarUrl || googleUser.photoURL || ""
                });

                return googleUser;
            }

            if (existingPendingUser.exists()) {
                // Update pending user location and avatar
                await updateDoc(pendingUserRef, {
                    "personalData.location": location,
                    avatarUrl: existingPendingUser.data().avatarUrl || googleUser.photoURL || ""
                });

                return googleUser;
            }

            // If user is new, create in pendingUsers
            await setDoc(pendingUserRef, {
                email: googleUser.email,
                name: googleUser.displayName || "",
                userVerificationStatus: "pending",
                emailVerified: googleUser.emailVerified,
                avatarUrl: googleUser.photoURL || "",
                avatarFileId: "",
                personalData: { location },
                createdAt: serverTimestamp()
            });

            return googleUser;
        } catch (error) {
            console.error("Google Sign-In Error:", error.message);
            throw error;
        }
    }


    // Check if user already exists
    async isUserExists(email) {
        try {
            const signInMethods = await fetchSignInMethodsForEmail(this.auth, email);
            return signInMethods.length > 0;
        } catch (error) {
            console.error("Auth Error [isUserExists]:", error.code, error.message);
            throw this.error;
        }
    }

    // login user
    async login(email, password, location) {
        try {
            const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
            const user = userCredential.user;
            const newUser = {
                personalData: {
                    ...user.personalData,
                    location: location
                }
            };
            await dbServices.updateDocument("users", user.uid, newUser);
            return user;
        } catch (error) {
            console.error("Firebase Auth : login() ::", error.message);
            throw error;
        }
    };

    async isEmailVerified() {
        const user = this.auth.currentUser;
        if (user) {
            return user.emailVerified;
        }
        return false;
    }

    // logout user
    async logout() {
        try {
            await signOut(this.auth);
            console.log("User logged out successfully");
        } catch (error) {
            console.error("Firebase Auth : logout() ::", error.message);
        }
    }

    async getCurrentUser() {
        const user = this.auth.currentUser;
        if (user) {
            console.log("Current logged-in user:", user.uid);
            return user;
        } else {
            console.log("No user is logged in");
            return null;
        }
    };

    async getCurrentUserData() {
        const user = this.auth.currentUser;
        if (user) {
            console.log("Current logged-in user:", user.uid);
            const userData = await dbServices.getDocument("users", user.uid);
            if (!userData) {
                return await dbServices.getDocument("pendingUsers", user.uid);
            }
            // console.log("Current logged-in user:", userData);
            return userData;
        } else {
            console.log("No user is logged in");
            return null;
        }
    }

    // forget password
    async sendPasswordReset(email) {
        try {
            await sendPasswordResetEmail(this.auth, email);
            console.log("Password reset email sent");
            console.log("If the email is registered, you will receive a password reset link shortly.");

        } catch (error) {
            console.error("Firebase Auth : sendPasswordReset() ::", error.message);
            throw error(error.message);
        }
    }

    // Update user password without sending an email
    async updatePassword(newPassword) {
        try {
            const user = this.auth.currentUser; // Get the current signed-in user
            if (!user) {
                throw new Error("No user is currently signed in.");
            }

            await updatePassword(user, newPassword);
            console.log("Password updated successfully.");

        } catch (error) {
            console.error("Firebase Auth : updatePassword() ::", error.message);
            throw error(error.message);
        }
    }

    async deleteUserAccount() {
        const user = this.auth.currentUser;
        if (user) {
            try {
                await deleteUser(user);
                console.log("User deleted successfully");
                await dbServices.deleteDocument('users', user.uid)
            } catch (error) {
                console.error("Firebase Auth : deleteUser() ::", error.message);
                throw error(error.message);
            }
        } else {
            console.log("No user is signed in.");
            throw new Error("No user is signed in to delete.");
        }
    }

    async sendVerificationEmail() {
        const user = this.auth.currentUser;
        if (user) {
            try {
                await sendEmailVerification(user);
                console.log("Verification email sent");
            } catch (error) {
                console.error("Firebase Auth : sendVeficationEmail() ::", error.message);
                throw new Error(error.message);
            }
        } else {
            console.log("No user is signed in to verify.");
            throw new Error("No user is signed in to verify.");
        }
    };
}

const userAuth = new Auth();

export default userAuth;