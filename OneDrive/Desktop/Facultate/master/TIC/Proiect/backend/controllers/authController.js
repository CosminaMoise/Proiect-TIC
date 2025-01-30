// authController.js
import admin from "firebase-admin";
import db from "../config/dbConfig.js";

const authController = {
  getCurrentUser: async (req, res) => {
    try {
      const { uid } = req.user;
      const userRef = db.collection("users").doc(uid);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        return res.status(404).json({ error: "User not found in database" });
      }
      res.status(200).json({
        success: true,
        data: userDoc.data(),
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
        profile: {
          fullName,
          bio: "",
          avatar: null,
          socialLinks: [],
        },
        preferences: {
          notifications: true,
          theme: "light",
        },
        activity: {
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          lastLogin: null,
          loginHistory: [],
          isActive: true,
        },
        permissions: {
          role: "user",
          accessLevel: 1,
          restrictedFeatures: [],
        },
        metadata: {
          deviceInfo: [],
          lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        },
      };

      await db.collection("users").doc(userRecord.uid).set(userData);

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          uid: userRecord.uid,
          email: userRecord.email,
          profile: {
            fullName: userData.profile.fullName,
          },
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
          success: false,
          error: errorMessages[error.code],
        });
      }

      res.status(500).json({
        success: false,
        error: "Registration failed. Please try again later.",
      });
    }
  },

  login: async (req, res) => {
    try {
      const { idToken } = req.body;

      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const { uid } = decodedToken;

      const userRef = db.collection("users").doc(uid);

      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      await userRef.update({
        "activity.lastLogin": admin.firestore.FieldValue.serverTimestamp(),
        "activity.loginHistory": admin.firestore.FieldValue.arrayUnion({
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          success: true,
        }),
        "metadata.lastUpdated": admin.firestore.FieldValue.serverTimestamp(),
      });

      const updatedUserDoc = await userRef.get();

      res.status(200).json({
        success: true,
        data: updatedUserDoc.data(),
      });
    } catch (err) {
      console.error("Error in login:", err);
      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  },

  logout: async (req, res) => {
    try {
      const { uid } = req.user;

      await db.collection("users").doc(uid).update({
        "activity.lastLogout": admin.firestore.FieldValue.serverTimestamp(),
        "metadata.lastUpdated": admin.firestore.FieldValue.serverTimestamp(),
      });

      res.status(200).json({
        success: true,
        message: "Logout successful",
      });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({
        success: false,
        error: "Logout failed",
      });
    }
  },
};

export default authController;
