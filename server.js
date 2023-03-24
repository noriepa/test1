const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { loadImage } = require('canvas');
const utils = require('./utils.js');
const path = require('path');
const fs = require('fs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/render-image', async (req, res) => {
  const { cigaretteText } = req.body;
  const blanks = JSON.parse(fs.readFileSync('blanks.json', 'utf-8'));
  const randomCig = blanks[Math.floor(Math.random() * blanks.length)];
  const ipfsUrl = 'https://bafybeigvhgkcqqamlukxcmjodalpk2kuy5qzqtx6m4i6pvb7o3ammss3y4.ipfs.dweb.link';

  loadImage(`${ipfsUrl}/${randomCig}.jpg`).then((image) => {
    const imageDataUrl = utils.putLabel(image, cigaretteText);
    res.contentType('image/jpeg');
    res.send(imageDataUrl);
  }).catch((err) => {
    console.log(err);
    res.status(500).send('Error rendering image');
  });
});

app.listen(3000, () => {
  console.log('App listening on port 3000');
});









