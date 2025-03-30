var express = require('express');
var cors = require('cors');
require('dotenv').config()
const multer = require('multer')
const path = require('path')
const fs = require('fs')

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

app.post('/api/fileanalyse', upload.array('upfile'), async (req, res)=>{
  let info = []
  req.files.forEach(file =>{
    info.push({"name":file.originalname, "type":file.mimetype, "size":file.size})
  })
  res.status(200).json(info)
})

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
