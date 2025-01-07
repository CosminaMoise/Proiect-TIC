const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

const PORT = 5000;
const FIREBASE_API_KEY = "AIzaSyABPk94L4Sk2yUvQO2o4at82BtefXeoc2Q";

const app = express();
app.use(cors());
app.use(express.json());

const serviceAccount = require("./firebase-service-account.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

app.get('/test-firestore', async (req, res) => {
  try {
    const docRef = db.collection('testCollection').doc('testDoc');
    await docRef.set({
      message: 'Hello from Firestore!',
    });
    res.send('Data saved to Firestore!');
  } catch (error) {
    res.status(500).send('Error connecting to Firestore: ' + error.message);
  }
});

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
