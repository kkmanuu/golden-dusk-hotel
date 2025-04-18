const admin = require('firebase-admin');
const db = admin.firestore();

const authController = {
    // Register a new user
    register: async (req, res) => {
        try {
            const { email, password, name } = req.body;

            // Create user in Firebase Auth
            const userRecord = await admin.auth().createUser({
                email,
                password,
                displayName: name
            });

            // Create user document in Firestore
            await db.collection('users').doc(userRecord.uid).set({
                name,
                email,
                role: 'user',
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });

            res.status(201).json({
                message: 'User registered successfully',
                uid: userRecord.uid
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ error: 'Failed to register user' });
        }
    },

    // Login user
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Sign in with Firebase Auth
            const userRecord = await admin.auth().getUserByEmail(email);

            // Generate custom token
            const customToken = await admin.auth().createCustomToken(userRecord.uid);

            res.json({
                message: 'Login successful',
                token: customToken,
                user: {
                    uid: userRecord.uid,
                    email: userRecord.email,
                    name: userRecord.displayName
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(401).json({ error: 'Invalid credentials' });
        }
    },

    // Get user profile
    getProfile: async (req, res) => {
        try {
            const userDoc = await db.collection('users').doc(req.user.uid).get();
            if (!userDoc.exists) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(userDoc.data());
        } catch (error) {
            console.error('Error fetching profile:', error);
            res.status(500).json({ error: 'Failed to fetch profile' });
        }
    },

    // Update user profile
    updateProfile: async (req, res) => {
        try {
            const { name, phone } = req.body;
            await db.collection('users').doc(req.user.uid).update({
                name,
                phone,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
            res.json({ message: 'Profile updated successfully' });
        } catch (error) {
            console.error('Error updating profile:', error);
            res.status(500).json({ error: 'Failed to update profile' });
        }
    },

    // Change password
    changePassword: async (req, res) => {
        try {
            const { newPassword } = req.body;
            await admin.auth().updateUser(req.user.uid, {
                password: newPassword
            });
            res.json({ message: 'Password updated successfully' });
        } catch (error) {
            console.error('Error changing password:', error);
            res.status(500).json({ error: 'Failed to change password' });
        }
    }
};

module.exports = authController;
