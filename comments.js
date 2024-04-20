// Create web server
// Run the web server

const express = require('express');
const bodyParser = require('body-parser');
const comments = require('./comments.json');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(bodyParser.json());

// Path: GET /comments
app.get('/comments', (req, res) => {
  res.json(comments);
});

// Path: POST /comments
app.post('/comments', (req, res) => {
  const newComment = req.body;

  if (!newComment.username || !newComment.comment) {
    res.status(400).send('Please provide username and comment');
    return;
  }

  comments.push(newComment);
  fs.writeFileSync('./comments.json', JSON.stringify(comments, null, 2));
  res.status(201).send('Comment added');
});

// Path: DELETE /comments/:id
app.delete('/comments/:id', (req, res) => {
  const id = req.params.id;
  const commentIndex = comments.findIndex((comment) => comment.id === id);

  if (commentIndex === -1) {
    res.status(404).send('Comment not found');
    return;
  }

  comments.splice(commentIndex, 1);
  fs.writeFileSync('./comments.json', JSON.stringify(comments, null, 2));
  res.status(200).send('Comment deleted');
});

// Path: PUT /comments/:id
app.put('/comments/:id', (req, res) => {
  const id = req.params.id;
  const updatedComment = req.body;
  const commentIndex = comments.findIndex((comment) => comment.id === id);

  if (commentIndex === -1) {
    res.status(404).send('Comment not found');
    return;
  }

  comments[commentIndex] = updatedComment;
  fs.writeFileSync('./comments.json', JSON.stringify(comments, null, 2));
  res.status(200).send('Comment updated');
});

// Path: GET /comments/:id
app.get('/comments/:id', (req, res) => {
  const id = req.params.id;
  const comment = comments.find((comment) => comment.id === id);

  if (!comment) {
    res.status(404).send('Comment not found');
    return;
  }

  res.json(comment);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost