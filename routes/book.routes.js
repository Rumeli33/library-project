const Book = require("../models/Book.model");
const Author = require("../models/Author.model");
const express = require("express");
const { route } = require("./index.routes");
const router = express.Router();


const isLoggedIn = require("../middleware/isLoggedIn");




/* display books from database  */
router.get("/books", (req, res, next) => {
  Book.find()
    .populate("author")
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
    .populate("author")
    .then((bookDetails) => {
      res.render("books/book-details", bookDetails);
    })
    .catch((err) => {
      console.log("error getting details from the db", err);
      next();
    });
});

/** route for CREATING A NEW BOOK BY THE USER */
router.get("/books/create", isLoggedIn, (req, res, next) => {
  Author.find()
    .then((authorsFromDb) => {
      console.log(authorsFromDb);

      res.render("books/book-create", {authorsFromDb});
    })
    .catch((err) => {
      console.log("error getting details from the db", err);
      next(err);
    });
});

// Create: part b : process the form and save the book to db

router.post("/books/create", isLoggedIn, (req, res, next) => {
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
    });
});

//UPDATE: display form
router.get("/books/:bookId/edit", isLoggedIn,(req, res, next) => {

  let authorsArr;

  Author.find()
      .then( (authorsFromDB) => {
          authorsArr = authorsFromDB;
          return Book.findById(req.params.bookId)
      })
      .then((bookDetails) => {
          const data = {
              bookDetails: bookDetails,
              authorsArr: authorsArr
          }

          res.render("books/book-edit", data);
      })
      .catch(err => {
          console.log("Error getting book details from DB...", err);
          next();
      });
});


//UPDATE: process form
router.post("/books/:bookId/edit",isLoggedIn, (req, res, next) => {
  const bookId = req.params.bookId;

  const newDetails = {
      title: req.body.title,
      author: req.body.author,
      description: req.body.description,
      rating: req.body.rating,
  }

  Book.findByIdAndUpdate(bookId, newDetails)
      .then(() => {
          res.redirect(`/books/${bookId}`);
      })
      .catch(err => {
          console.log("Error updating book...", err);
          next();
      });
});


//DELETE
router.post("/books/:bookId/delete", isLoggedIn, (req, res, next) => {
  Book.findByIdAndDelete(req.params.bookId)
      .then(() => {
          res.redirect("/books");
      })
      .catch(err => {
          console.log("Error deleting book...", err);
          next();
      });

});


module.exports = router;
