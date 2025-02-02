import admin from "firebase-admin";
import serviceAccount from "../firebase-service-account.json" assert { type: "json" };

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

const testConnection = async () => {
  try {
    await db.collection("test").doc("test").set({
      test: "Connection successful",
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log("Firebase connection successful!");
  } catch (error) {
    console.error("Firebase connection error:", error);
  }
};

const populateDatabase = async () => {
  try {
    const token =
      "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTczODUwNjE0NSwiZXhwIjoxNzM4NTA5NzQ1LCJpc3MiOiJmaXJlYmFzZS1hZG1pbnNkay1wbTVzOEBwcm9pZWN0dGljLTY5YTQ4LmlhbS5nc2VydmljZWFjY291bnQuY29tIiwic3ViIjoiZmlyZWJhc2UtYWRtaW5zZGstcG01czhAcHJvaWVjdHRpYy02OWE0OC5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsInVpZCI6IjlPTFpDdTJpZUdmQnNiSjRkMzJabEVTMTl1ajIifQ.TpTFC4-m097n_gz_jVcxURE57Mg8ET4JdkU-4tcEJOMYgdJ_KXPWHLyKp4-bjFKGIpSzruO4xHYyIlWJCY3y3fTpMnWYZUPckQGo06pptKnRJ2XrYdPiaee9-vZIqUCUbKcafGIrPH5DcxJTdb5qtDx0wo87ne0Z1nf0GF6DR_65ga14Voa7Zb3aFlxndeygyghy6X1r6krsvgxHnipXo0F9MzukTsQaTBX-xStY-IVZgWkYc75i3ehOkcSg6J7LeUJTpKU4iNTfRypuWnUkug5vvDXJQQ84cuMrnQwIEeJ1K8pHT7ahovcEmD09J2RDjxUFUaiMQJB6iPsl0w8Srw";
    const books = [
      {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        publisher: "Scribner",
        publishYear: 1925,
        publishLocation: "New York",
        description:
          "The story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan, capturing the essence of the Jazz Age.",
        imageUrl: "https://example.com/gatsby.jpg",
        metadata: {
          createdBy: "token",
          creatorName: "Cosmina Moise",
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        },
        status: {
          isAvailable: true,
          currentBorrower: null,
          borrowHistory: [],
        },
      },
      {
        title: "1984",
        author: "George Orwell",
        publisher: "Secker and Warburg",
        publishYear: 1949,
        publishLocation: "London",
        description:
          "A dystopian novel set in a totalitarian society, following Winston Smith's rebellion against the omnipresent government surveillance.",
        imageUrl: "https://example.com/1984.jpg",
        metadata: {
          createdBy: "token",
          creatorName: "Cosmina Moise",
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        },
        status: {
          isAvailable: true,
          currentBorrower: null,
          borrowHistory: [],
        },
      },
      {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        publisher: "J. B. Lippincott & Co.",
        publishYear: 1960,
        publishLocation: "Philadelphia",
        description:
          "A story of racial injustice and the loss of innocence in the American South, told through the eyes of young Scout Finch.",
        imageUrl: "https://example.com/mockingbird.jpg",
        metadata: {
          createdBy: "token",
          creatorName: "Cosmina Moise",
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        },
        status: {
          isAvailable: true,
          currentBorrower: null,
          borrowHistory: [],
        },
      },
      {
        title: "Pride and Prejudice",
        author: "Jane Austen",
        publisher: "T. Egerton, Whitehall",
        publishYear: 1813,
        publishLocation: "London",
        description:
          "A romantic novel following Elizabeth Bennet's dealing with issues of manners, upbringing, morality, education, and marriage.",
        imageUrl: "https://example.com/pride.jpg",
        metadata: {
          createdBy: "token",
          creatorName: "Cosmina Moise",
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        },
        status: {
          isAvailable: true,
          currentBorrower: null,
          borrowHistory: [],
        },
      },
      {
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
        publisher: "Little, Brown and Company",
        publishYear: 1951,
        publishLocation: "Boston",
        description:
          "The story of Holden Caulfield's experiences in New York City after being expelled from his prep school.",
        imageUrl: "https://example.com/catcher.jpg",
        metadata: {
          createdBy: "token",
          creatorName: "Cosmina Moise",
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        },
        status: {
          isAvailable: true,
          currentBorrower: null,
          borrowHistory: [],
        },
      },
      {
        title: "The Lord of the Rings",
        author: "J.R.R. Tolkien",
        publisher: "Allen & Unwin",
        publishYear: 1954,
        publishLocation: "London",
        description:
          "An epic high-fantasy novel following the quest to destroy the One Ring and defeat the Dark Lord Sauron.",
        imageUrl: "https://example.com/lotr.jpg",
        metadata: {
          createdBy: "token",
          creatorName: "Cosmina Moise",
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        },
        status: {
          isAvailable: true,
          currentBorrower: null,
          borrowHistory: [],
        },
      },
      {
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        publisher: "George Allen & Unwin",
        publishYear: 1937,
        publishLocation: "London",
        description:
          "The tale of Bilbo Baggins' adventure with a group of dwarves to reclaim their mountain home from a dragon.",
        imageUrl: "https://example.com/hobbit.jpg",
        metadata: {
          createdBy: "token",
          creatorName: "Cosmina Moise",
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        },
        status: {
          isAvailable: true,
          currentBorrower: null,
          borrowHistory: [],
        },
      },
      {
        title: "Brave New World",
        author: "Aldous Huxley",
        publisher: "Chatto & Windus",
        publishYear: 1932,
        publishLocation: "London",
        description:
          "A dystopian novel set in a genetically engineered future where society is hedonistic and technologically advanced.",
        imageUrl: "https://example.com/brave.jpg",
        metadata: {
          createdBy: "token",
          creatorName: "Cosmina Moise",
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        },
        status: {
          isAvailable: true,
          currentBorrower: null,
          borrowHistory: [],
        },
      },
      {
        title: "The Picture of Dorian Gray",
        author: "Oscar Wilde",
        publisher: "Ward, Lock and Company",
        publishYear: 1890,
        publishLocation: "London",
        description:
          "A Gothic novel about a man whose portrait ages while he remains young, exploring themes of hedonism and morality.",
        imageUrl: "https://example.com/dorian.jpg",
        metadata: {
          createdBy: "token",
          creatorName: "Cosmina Moise",
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        },
        status: {
          isAvailable: true,
          currentBorrower: null,
          borrowHistory: [],
        },
      },
      {
        title: "Fahrenheit 451",
        author: "Ray Bradbury",
        publisher: "Ballantine Books",
        publishYear: 1953,
        publishLocation: "New York",
        description:
          "A dystopian novel about a future American society where books are outlawed and firemen burn any that are found.",
        imageUrl: "https://example.com/fahrenheit.jpg",
        metadata: {
          createdBy: "token",
          creatorName: "Cosmina Moise",
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        },
        status: {
          isAvailable: true,
          currentBorrower: null,
          borrowHistory: [],
        },
      },
    ];

    const batch = db.batch();
    books.forEach((book) => {
      const bookRef = db.collection("books").doc();
      batch.set(bookRef, book);
    });

    await batch.commit();
    console.log("Database populated successfully with 10 books!");
  } catch (error) {
    console.error("Error populating database:", error);
  }
};

const clearDatabase = async () => {
  try {
    const collections = ["books", "users"];
    for (const collectionName of collections) {
      const snapshot = await db.collection(collectionName).get();
      const batch = db.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    }
    console.log("Database cleared successfully!");
  } catch (error) {
    console.error("Error clearing database:", error);
  }
};

export { db as default, testConnection, populateDatabase, clearDatabase };
