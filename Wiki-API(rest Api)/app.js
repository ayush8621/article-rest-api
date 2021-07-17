//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/wikiDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

const articleschema = new mongoose.Schema({
  title: "String",
  content: "String"
});

const Article = mongoose.model("Article", articleschema);

///////////////////////////// Requests Targeting all articles /////////////////////////////////////////////////

app.route("/articles")
  .get(function(req, res) {
    Article.find(function(err, articles) {
      if (!err)
        res.send(result);
      else
        res.send(err);
    });
  })

  .post(function(req, res) {
    const article = new Article({
      title: req.body.title,
      content: req.body.content
    });
    article.save(function(err) {
      if (!err) {
        res.send("Successful");
      } else {
        res.send(err);
      }
    });
  })

  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (!err) {
        res.send("Successful");
      } else {
        res.send(err);
      }
    });
  });

///////////////////////////// Requests Targeting specific article /////////////////////////////////////////////////

app.route("/articles/:articletitle")
  .get(function(req, res) {
    Article.findOne({
      title: req.params.articletitle
    }, function(err, article) {
      if (!err)
        res.send(article);
      else
        res.send(err);
    });
  })

  .put(function(req, res) {
    Article.update({
        title: req.params.articletitle
      }, {
        title: req.body.title,
        content: req.body.content
      }, {
        overwrite: true
      },
      function(err) {
        if (!err) {
          res.send("Successful");
        } else {
          res.send(err);
        }

      });
  })

  .patch(function(req, res) {
      Article.update({
          title: req.params.articletitle
        }, {
          $set: req.body
        },
        function(err) {
          if (!err) {
            res.send("Successful");
          } else {
            res.send(err);
          }
        }
      );
    })

    .delete(function(req,res){
      Article.deleteOne({title:req.params.articletitle},function(err){
        if(!err){
          res.send("Successful");
        }
        else{
          res.send(err);
        }
      });
    });









    app.listen(3000, function() {
      console.log("Server started on port 3000");
    });
