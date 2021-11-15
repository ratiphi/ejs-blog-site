const express = require("express");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require("mongoose");
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

mongoose.connect("mongodb://localhost:27017/journalDB");
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
});

const Post = mongoose.model("Post", postSchema);
// const post = new Post({
//   title: "A Post Title",
//   content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Placerat orci nulla pellentesque dignissim. Tincidunt ornare massa eget egestas purus viverra accumsan in nisl. Tempor commodo ullamcorper a lacus vestibulum sed arcu non odio. Ultrices neque ornare aenean euismod elementum nisi quis eleifend. Scelerisque purus semper eget duis at tellus at urna condimentum."
// });
// each time this is executed will create new posts
// post.save();

// const post1 = new Post({
//   title: "Another Post Title",
//   content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Placerat orci nulla pellentesque dignissim. Tincidunt ornare massa eget egestas purus viverra accumsan in nisl. Tempor commodo ullamcorper a lacus vestibulum sed arcu non odio. Ultrices neque ornare aenean euismod elementum nisi quis eleifend. Scelerisque purus semper eget duis at tellus at urna condimentum."
// });
// const post2 = new Post({
//   title: "Another Post Title2",
//   content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Placerat orci nulla pellentesque dignissim. Tincidunt ornare massa eget egestas purus viverra accumsan in nisl. Tempor commodo ullamcorper a lacus vestibulum sed arcu non odio. Ultrices neque ornare aenean euismod elementum nisi quis eleifend. Scelerisque purus semper eget duis at tellus at urna condimentum."
// });
// const post3 = new Post({
//   title: "Another Post Title3",
//   content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Placerat orci nulla pellentesque dignissim. Tincidunt ornare massa eget egestas purus viverra accumsan in nisl. Tempor commodo ullamcorper a lacus vestibulum sed arcu non odio. Ultrices neque ornare aenean euismod elementum nisi quis eleifend. Scelerisque purus semper eget duis at tellus at urna condimentum."
// });
// each time this is executed will create new posts
// Post.insertMany([post1, post2, post3], function(err){
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("Successfully added the posts to journalDB");
//   }
// });

Post.find(function(err, posts) {
  if (err) {
    console.log(err);
  } else {
    posts.forEach(post => {
      console.log(post.title);
    });
    
    console.log("Successfully found all your posts!");
    mongoose.connection.close();
  }
});

const app = express();
let postsArr = [];

app.set('view engine', 'ejs');

app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.render("home", {
    startingContent: homeStartingContent,
    posts: postsArr
  });
});

app.get("/about", function (req, res) {
  res.render("about", {
    startingContent: aboutContent
  });
});

app.get("/contact", function (req, res) {
  res.render("contact", {
    startingContent: contactContent
  });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.get("/posts/:postName", function(req, res) {
  let requestedTitle = _.lowerCase(req.params.postName);
  
  postsArr.forEach(post => {
    let storedTitle = _.lowerCase(post.title);
    if (storedTitle === requestedTitle) {
      res.render("post", {
        title: post.title,
        content: post.content
      });
    }
  });

});

app.post("/compose", function (req, res) {
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody
  };
  postsArr.push(post);
  res.redirect("/");
});





app.listen(3000, function () {
  console.log("Server started on port 3000");
});