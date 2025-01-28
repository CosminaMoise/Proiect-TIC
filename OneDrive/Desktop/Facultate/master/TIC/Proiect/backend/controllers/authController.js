import admin from "firebase-admin";
import db from "../config/dbConfig.js";

const authController = {
  getCurrentUser: async (req, res) => {
    try {
      const { uid, email } = req.user;

      const userRef = db.collection("users").doc(uid);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        return res.status(404).json({ error: "User not found in database" });
      }

      const userData = userDoc.data();

      const userDetailsRef = db.collection("userDetails").doc(uid);
      const userDetailsDoc = await userDetailsRef.get();

      res.status(200).json({
        uid,
        email,
        ...userData,
        details: userDetailsDoc.exists ? userDetailsDoc.data() : null,
      });
    } catch (err) {
      console.error("Error in getCurrentUser:", err);
      return res.status(500).send(err.message);
    }
  },

  register: async (req, res) => {
    try {
      const { email, password, fullName } = req.body;

      if (!email || !password || !fullName) {
        return res.status(400).json({
          error:
            "Please provide all required fields: email, password, and full name",
        });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: "Please provide a valid email address",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          error: "Password must be at least 6 characters long",
        });
      }

      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName: fullName,
        emailVerified: false,
      });

      const userData = {
        uid: userRecord.uid,
        email: userRecord.email,
        fullName,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastLogin: null,
        isActive: true,
        preferences: {
          notifications: true,
          theme: "light",
        },
        profile: {
          bio: "",
          avatar: null,
          socialLinks: {},
        },
      };

      await db.collection("users").doc(userRecord.uid).set(userData);

      res.status(201).json({
        message: "User registered successfully",
        user: {
          uid: userRecord.uid,
          email: userRecord.email,
          fullName,
          createdAt: userData.createdAt,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessages = {
        "auth/email-already-exists":
          "An account with this email already exists",
        "auth/invalid-password": "Password must be at least 6 characters long",
        "auth/invalid-email": "The email address is not valid",
        "auth/weak-password": "The password is too weak",
      };

      if (error.code && errorMessages[error.code]) {
        return res.status(400).json({
          error: errorMessages[error.code],
        });
      }

      res.status(500).json({
        error: "Registration failed. Please try again later.",
      });
    }
  },

  login: async (req, res) => {
    try {
      const { idToken } = req.body;

      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const { uid, email } = decodedToken;

      const userRef = db.collection("users").doc(uid);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        const userData = {
          email,
          role: email.endsWith("@csie.ase.ro") ? "admin" : "student",
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          lastLogin: admin.firestore.FieldValue.serverTimestamp(),
          loginCount: 1,
        };

        await userRef.set(userData);

        return res.status(200).json({
          uid,
          ...userData,
          email,
        });
      }

      await userRef.update({
        lastLogin: admin.firestore.FieldValue.serverTimestamp(),
        loginCount: admin.firestore.FieldValue.increment(1),
      });

      res.status(200).json({
        uid,
        email,
        ...userDoc.data(),
      });
    } catch (err) {
      console.error("Error in login:", err);
      return res.status(500).send(err.message);
    }
  },
  logout: async (req, res) => {
    try {
      res.status(200).json({
        message: "Logout successful",
      });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({
        error: "Logout failed",
      });
    }
  },
};

export default authController;
