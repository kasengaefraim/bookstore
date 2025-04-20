import express from "express";
import fs from "fs/promises";
import path from "path";
import protectRoute from "../middleware/auth.middleware.js";
import Book from "../models/Book.js";
const router = express.Router();

router.post("/", protectRoute, async (req, res) => {
    try {

        const { title, caption, rating, image } = req.body;
        if (!image || !title || !caption || !rating) {
            return res.status(400).json({ message: "please provide all fields" });
        }
        await fs.writeFile(
            path.join(__dirname, "images",)
        );

        const imageUrl = '';
        const newBook = new Book({
            title,
            caption,
            rating,
            image: imageUrl,
            user: req.user._id
        });
        await newBook.save();
        res.status(201).json(newBook);

    } catch (error) {
        console.log("Error creating book", error);
        res.status(500).json({ message: error.message });
    }
})

router.get("/", protectRoute, async (req, res) => {
    try {

        const page = req.query.page || 1;
        const limit = req.query.limit || 5;
        const skip = (page - 1) * limit;

        const books = await Book.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("user", "username profileImage");
        const totalBooks = await Book.countDocuments();
        res.send({
            books,
            currentPage: page,
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit),
        });

    } catch (error) {
        console.log("Error getting books", error);
        res.status(500).json({ message: "internal server error" });
    }
})

router.get("/user", protectRoute, async (req, res) => {
    try {
        const books = await Book.find({ user: req.user._id })
            .sort({ createdAt: -1 });
        res.json(books);

    } catch (error) {
        console.error("Get user books error", error.message);
        res.status(500).json({ message: "internal server error" });
    }
})

router.delete("/:id", protectRoute, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: "Book not found" });
        if (book.user.toString() != req.user._id.toString()) return res.status(401).json({ message: "unauthorized" });
        //delete image from storage then in db
        await book.deleteOne();
        res.json({ message: "Book deleted successfully" });

    } catch (error) {
        console.log("Error deleting book", error);
        res.status(500).json({ message: "internal server error" });
    }
})
export default router;