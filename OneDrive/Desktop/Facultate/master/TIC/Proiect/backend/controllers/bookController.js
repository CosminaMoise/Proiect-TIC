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
  getAllBooks: async (req, res) => {
    try {
      const {
        limit = 10,
        page = 1,
        sortBy = "title",
        order = "asc",
      } = req.query;

      let booksRef = db.collection("books");

      booksRef = booksRef.orderBy(sortBy, order);

      const startAt = (page - 1) * limit;
      const snapshot = await booksRef
        .limit(parseInt(limit))
        .offset(startAt)
        .get();

      const books = [];
      snapshot.forEach((doc) => {
        books.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      res.status(200).json({
        success: true,
        data: books,
        metadata: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: snapshot.size,
        },
      });
    } catch (error) {
      console.error("Error getting books:", error);
      res.status(500).json({
        success: false,
        error: "Failed to retrieve books",
      });
    }
  },

  getBookById: async (req, res) => {
    try {
      const { bookId } = req.params;

      const bookRef = db.collection("books").doc(bookId);
      const bookDoc = await bookRef.get();

      if (!bookDoc.exists) {
        return res.status(404).json({
          success: false,
          error: "Book not found",
        });
      }

      res.status(200).json({
        success: true,
        data: {
          id: bookDoc.id,
          ...bookDoc.data(),
        },
      });
    } catch (error) {
      console.error("Error getting book:", error);
      res.status(500).json({
        success: false,
        error: "Failed to retrieve book",
      });
    }
  },

  deleteBook: async (req, res) => {
    try {
      const { bookId } = req.params;
      const { uid } = req.user;

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
          error: "You don't have permission to delete this book",
        });
      }

      if (bookData.status.currentBorrower) {
        return res.status(400).json({
          success: false,
          error: "Cannot delete a book that is currently borrowed",
        });
      }

      await bookRef.delete();

      res.status(200).json({
        success: true,
        message: "Book deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting book:", error);
      res.status(500).json({
        success: false,
        error: "Failed to delete book",
      });
    }
  },

  searchBooks: async (req, res) => {
    try {
      const { query, field = "title", limit = 10 } = req.query;

      if (!query) {
        return res.status(400).json({
          success: false,
          error: "Search query is required",
        });
      }

      const booksRef = db.collection("books");
      const snapshot = await booksRef
        .where(field, ">=", query)
        .where(field, "<=", query + "\uf8ff")
        .limit(parseInt(limit))
        .get();

      const books = [];
      snapshot.forEach((doc) => {
        books.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      res.status(200).json({
        success: true,
        data: books,
      });
    } catch (error) {
      console.error("Error searching books:", error);
      res.status(500).json({
        success: false,
        error: "Failed to search books",
      });
    }
  },
};

export default bookController;
