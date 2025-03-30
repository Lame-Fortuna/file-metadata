var express = require('express');
var cors = require('cors');
require('dotenv').config()
const multer = require('multer')
const path = require('path')
const fs = require('fs');
const { error } = require('console');

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Ensuring the directory '/files' exist
const dir = path.join(__dirname, 'files');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

//Mult storage directory
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'files/'); // Store files in the folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Unique filename
    }
});

const upload = multer({ storage: storage });

app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size
  });
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
