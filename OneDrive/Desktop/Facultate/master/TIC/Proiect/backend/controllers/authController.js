import db from '../config/dbConfig.js';

const authController = {
    getCurrentUser: async (req, res) => {
        try {
            // Get user details from token verification
            const { uid, email } = req.user;
            
            // Reference to the user document in Firestore
            const userRef = db.collection('users').doc(uid);
            const userDoc = await userRef.get();

            if (!userDoc.exists) {
                return res.status(404).json({ error: 'User not found in database' });
            }

            // Combine auth data with Firestore data
            const userData = userDoc.data();
            
            // Get user's additional data in a single query
            const userDetailsRef = db.collection('userDetails').doc(uid);
            const userDetailsDoc = await userDetailsRef.get();
            
            res.status(200).json({
                uid,
                email,
                ...userData,
                details: userDetailsDoc.exists ? userDetailsDoc.data() : null
            });
        } catch (err) {
            console.error('Error in getCurrentUser:', err);
            return res.status(500).send(err.message);
        }
    },

    login: async (req, res) => {
        try {
            const { idToken } = req.body;
            
            // Verify Firebase token
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            const { uid, email } = decodedToken;

            // Get user data with a single query
            const userRef = db.collection('users').doc(uid);
            const userDoc = await userRef.get();

            if (!userDoc.exists) {
                // If user document doesn't exist, create it
                const userData = {
                    email,
                    role: email.endsWith('@csie.ase.ro') ? 'admin' : 'student',
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    lastLogin: admin.firestore.FieldValue.serverTimestamp(),
                    loginCount: 1
                };

                await userRef.set(userData);

                return res.status(200).json({
                    uid,
                    ...userData,
                    email
                });
            }

            // Update last login time and increment login count
            await userRef.update({
                lastLogin: admin.firestore.FieldValue.serverTimestamp(),
                loginCount: admin.firestore.FieldValue.increment(1)
            });

            res.status(200).json({
                uid,
                email,
                ...userDoc.data()
            });
        } catch (err) {
            console.error('Error in login:', err);
            return res.status(500).send(err.message);
        }
    },

    updateUserProfile: async (req, res) => {
        try {
            const { uid } = req.user;
            const updates = req.body;

            // Reference to user document
            const userRef = db.collection('users').doc(uid);
            
            // Update user profile using Firestore atomic operations
            await userRef.update({
                ...updates,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });

            // Get updated user data
            const updatedDoc = await userRef.get();
            
            res.status(200).json({
                uid,
                ...updatedDoc.data()
            });
        } catch (err) {
            console.error('Error updating profile:', err);
            return res.status(500).send(err.message);
        }
    },

    // Example of batch operations
    createUserWithDetails: async (req, res) => {
        try {
            const { uid } = req.user;
            const { profile, details } = req.body;

            // Create a batch for atomic operations
            const batch = db.batch();

            // Reference to user documents
            const userRef = db.collection('users').doc(uid);
            const detailsRef = db.collection('userDetails').doc(uid);

            // Set up batch operations
            batch.set(userRef, {
                ...profile,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });

            batch.set(detailsRef, {
                ...details,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });

            // Commit the batch
            await batch.commit();

            res.status(201).json({ message: 'User profile created successfully' });
        } catch (err) {
            console.error('Error in createUserWithDetails:', err);
            return res.status(500).send(err.message);
        }
    }
};

export default authController;