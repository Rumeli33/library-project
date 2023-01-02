const Book = require("../models/Book.model");
const express = require("express");
const { route } = require("./index.routes");
const router = express.Router();

/* display books from database  */
router.get("/books", (req, res, next) => {
  Book.find()
    .then((booksFromDb) => {
      
      res.render("books/books-list", { books: booksFromDb });
    })
    .catch((err) => {
      console.log("error getting details from the db", err);
      next();
    });
});

/* book details*/
router.get("/books/:bookId", (req, res, next) => {
  const id = req.params.bookId;
  Book.findById(id)
    .then((bookDetails) => {
     
      res.render("books/book-details", bookDetails);
    })
    .catch((err) => {
      console.log("error getting details from the db", err);
      next();
    });
});

/** route for CREATING A NEW BOOK BY THE USER */
router.get("/books/create", (req, res, next) => {
  res.render("books/book-create");
});


// Create: part b : process the form and save the book to db

router.post("/books/create", (req, res, next) => {
  const bookDetail = {
    title: req.body.title,
    description: req.body.description,
    author: req.body.author,
    rating: req.body.rating,
  };
  Book.create(bookDetail)
    .then((bookDetails) => {
      //res.send("your book was created");
      res.redirect("/books");
    })
    .catch((err) => {
      console.log("err creating new book to the db", err);
      next();
    })
});


/** Update : part 1 : display form that is prepopulated */

router.get("/books/:bookId/edit",(req,res,next) =>{
    Book.findById(req.params.bookId)
    .then((bookdetails) =>{
        res.render("books/book-edit",bookdetails);
    })
    .catch(err =>{
        console.log("err displaying book detail from db",err);
        next();
    })
})

/** Update : part 2 : process form that is updated */

router.post("/books/:bookId/edit", (req, res, next) => {
    const bookId = req.params.bookId;
    const newDetail = {
      title: req.body.title,
      description: req.body.description,
      author: req.body.author,
      rating: req.body.rating,
    };
    Book.findByIdAndUpdate(bookId,newDetail)
      .then((bookDetails) => {
        //res.send("your book was created");
        res.redirect(`/books/${bookId}`);
      })
      .catch((err) => {
        console.log("error updating book to the db", err);
        next();
      })
  });

/** Delete :Deleting a book */
router.post("/books/:bookId/delete",(req,res,next) => {
    
    Book.findByIdAndDelete(req.params.bookId)
    .then(() =>{
        console.log("book deleted");
        res.redirect("/books")
    })
    .catch(err =>{
        console.log("error deleting the book from the database",err);
        next();
    });
});


module.exports = router;
