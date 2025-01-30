import admin from "firebase-admin";
import db from "../config/dbConfig.js";

const bookController = {
  createBook: async (req, res) => {
    try {
      const { uid } = req.user;
      const {
        title,
        author,
        publisher,
        publishYear,
        publishLocation,
        description,
        imageUrl,
      } = req.body;

      if (
        !title ||
        !author ||
        !publisher ||
        !publishYear ||
        !publishLocation ||
        !description
      ) {
        return res.status(400).json({
          success: false,
          error: "All fields are required except image",
        });
      }

      const bookData = {
        title,
        author,
        publisher,
        publishYear,
        publishLocation,
        description,
        imageUrl: imageUrl || null,
        metadata: {
          createdBy: uid,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        },
        status: {
          isAvailable: true,
          currentBorrower: null,
          borrowHistory: [],
        },
      };

      const bookRef = await db.collection("books").add(bookData);
      const newBook = await bookRef.get();

      res.status(201).json({
        success: true,
        message: "Book added successfully",
        data: {
          id: bookRef.id,
          ...newBook.data(),
        },
      });
    } catch (error) {
      console.error("Error creating book:", error);
      res.status(500).json({
        success: false,
        error: "Failed to create book. Please try again.",
      });
    }
  },
  updateBook: async (req, res) => {
    try {
      const { bookId } = req.params;
      const { uid } = req.user;
      const {
        title,
        author,
        publisher,
        publishYear,
        publishLocation,
        description,
        imageUrl,
      } = req.body;

      const bookRef = db.collection("books").doc(bookId);
      const bookDoc = await bookRef.get();

      if (!bookDoc.exists) {
        return res.status(404).json({
          success: false,
          error: "Book not found",
        });
      }

      const bookData = bookDoc.data();
      if (bookData.metadata.createdBy !== uid) {
        return res.status(403).json({
          success: false,
          error: "You don't have permission to edit this book",
        });
      }

      const updateData = {};

      if (title) updateData.title = title;
      if (author) updateData.author = author;
      if (publisher) updateData.publisher = publisher;
      if (publishYear) updateData.publishYear = publishYear;
      if (publishLocation) updateData.publishLocation = publishLocation;
      if (description) updateData.description = description;
      if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

      updateData["metadata.lastUpdated"] =
        admin.firestore.FieldValue.serverTimestamp();

      await bookRef.update(updateData);

      const updatedBookDoc = await bookRef.get();

      res.status(200).json({
        success: true,
        message: "Book updated successfully",
        data: {
          id: bookId,
          ...updatedBookDoc.data(),
        },
      });
    } catch (error) {
      console.error("Error updating book:", error);
      res.status(500).json({
        success: false,
        error: "Failed to update book. Please try again.",
      });
    }
  },
};

export default bookController;
