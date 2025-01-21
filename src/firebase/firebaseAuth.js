import { createUserWithEmailAndPassword, sendEmailVerification, fetchSignInMethodsForEmail, updatePassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";
import app from './firebaseConfig.js'
import { getAuth } from "firebase/auth";
import dbServices from './firebaseDb.js'



class Auth {
    auth;
    constructor() {
        this.auth = getAuth(app)
    }

    // Register new user
    async register(email, password) {
        try {
            const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
            const user = userCredential.user;
            console.log("User registered:", user.uid, user.email);
            console.log(user.id, user)
            await dbServices.addDocument('users', user.uid, { email: user.email })
            return user;
        } catch (error) {
            console.error("Firebase Auth : register() ::", error.message);
            throw error;
        }
    };

    // login user
    async login(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
            const user = userCredential.user;
            console.log("User logged in:", user.uid);
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

    // forget password
    async sendPasswordReset(email) {
        try {
            const methods = await fetchSignInMethodsForEmail(this.auth, email);

            if (methods.length === 0) {
                console.log("Email is not registered.");
                alert("This email is not registered. Please use a valid email address.");
                return;
            }

            // If email is registered, send the password reset email
            await sendPasswordResetEmail(this.auth, email);
            console.log("Password reset email sent");
            alert("If the email is registered, you will receive a password reset link shortly.");

        } catch (error) {
            console.error("Firebase Auth : sendPasswordReset() ::", error.message);
            alert("Error sending password reset email. Please try again.");
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
            alert("Your password has been updated.");
        } catch (error) {
            console.error("Firebase Auth : updatePassword() ::", error.message);
            alert("Error updating password. Please try again.");
        }
    }

    async deleteUserAccount() {
        const user = this.auth.currentUser;
        if (user) {
            try {
                await deleteUser(user);
                console.log("User deleted successfully");
                await dbServices.deleteDocument('users', user.uid)
                alert("Your account has been deleted.");
            } catch (error) {
                console.error("Firebase Auth : deleteUser() ::", error.message);
                alert("Error deleting account. Please try again.");
            }
        } else {
            console.log("No user is signed in.");
            alert("You need to be logged in to delete your account.");
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
            }
        } else {
            console.log("No user is signed in to verify.");
        }
    };
}

const userAuth = new Auth();

export default userAuth;