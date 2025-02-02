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
      console.log("Starting registration process");
      const { email, password, fullName } = req.body;

      console.log("Registration attempt:", { email, fullName });

      if (!email || !password || !fullName) {
        return res.status(400).json({
          success: false,
          error:
            "Please provide all required fields: email, password, and full name",
        });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          error: "Please provide a valid email address",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          error: "Password must be at least 6 characters long",
        });
      }

      console.log("Creating user in Firebase Auth");
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName: fullName,
        emailVerified: false,
      });

      console.log("User created in Firebase Auth:", userRecord.uid);

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

      console.log("Creating user document in Firestore");

      await db.collection("users").doc(userRecord.uid).set(userData);
      console.log("User document created in Firestore");

      const customToken = await admin.auth().createCustomToken(userRecord.uid);

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          uid: userRecord.uid,
          email: userRecord.email,
          token: customToken,
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

      const errorMessage =
        process.env.NODE_ENV === "development"
          ? error.message
          : "Registration failed. Please try again later.";

      res.status(500).json({
        success: false,
        error: errorMessage,
      });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: "Email and password are required",
        });
      }

      try {
        const userRecord = await admin.auth().getUserByEmail(email);

        const userRef = db.collection("users").doc(userRecord.uid);
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
            timestamp: new Date().toISOString(),
            success: true,
          }),
        });

        const customToken = await admin
          .auth()
          .createCustomToken(userRecord.uid);

        res.status(200).json({
          success: true,
          data: {
            uid: userRecord.uid,
            email: userRecord.email,
            token: customToken,
            ...userDoc.data(),
          },
        });
      } catch (authError) {
        console.error("Authentication error:", authError);
        return res.status(401).json({
          success: false,
          error: "Invalid email or password",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        error: "Login failed",
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
