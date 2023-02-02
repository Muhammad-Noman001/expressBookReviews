const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

public_users.post("/register", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred"});
    } else {
      return res.status(404).json({message: "User already exists"});
    }
  }
  return res.status(404).json({message: "Unable to register user"});
});

// Get the book list available in the shop
let promiseOne = new Promise((resolve,reject)=>{
    public_users.get('/',function (req, res) {
    return res.status(200).json(JSON.stringify(books,null,4));
    });
    setTimeout(() => {
        resolve("PromiseOne resolved")
      },3000)
});

// Get book details based on ISBN
let promiseTwo = new Promise((resolve,reject)=>{
    public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    for(let i in books){
        if(books[i]['isbn'] == isbn){
            return res.status(200).json(JSON.stringify(books[i],null,4));
        }
    }
    return res.status(404).json({message: "Book Not Found"});
    });
    setTimeout(() => {
        resolve("PromiseTwo resolved")
      },3000)
});

  
// Get book details based on author
let promiseThree = new Promise((resolve,reject)=>{
    public_users.get('/author/:author',function (req, res) {
    let author = req.params.author;
    for(let a in books){
        if(books[a]['author'] == author){
            return res.status(200).json(JSON.stringify(books[a],null,4));
        }
    }
    return res.status(404).json({message: "No Books available from this Author"});
    });
    setTimeout(() => {
        resolve("PromiseThree resolved")
      },3000)
});

// Get all books based on title
let promiseFour = new Promise((reject,resolve)=>{
    public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    for(let t in books){
        if(books[t]['title'] == title){
            return res.status(200).json(JSON.stringify(books[t],null,4));
        }
    }
    return res.status(404).json({message: "No Book available with this Title"});
    });
    setTimeout(() => {
        resolve("PromiseThree resolved")
      },3000)
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  for(let i in books){
      if(books[i]['isbn'] == isbn){
        return res.status(200).json(JSON.stringify(books[i]['review'],null,4));
      }
  }
  return res.status(404).json({message: "No Book available with this ISBN"});
});

promiseOne.then((successMsg)=>{
    console.log(successMsg);
}).catch((err)=>{
    console.log(err);
});

promiseTwo.then((successMsg)=>{
    console.log(successMsg);
}).catch((err)=>{
    console.log(err);
});

promiseThree.then((successMsg)=>{
    console.log(successMsg);
}).catch((err)=>{
    console.log(err);
});

promiseFour.then((successMsg)=>{
    console.log(successMsg);
}).catch((err)=>{
    console.log(err);
});

module.exports.general = public_users;
