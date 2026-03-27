const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

if (!fs.existsSync('./uploads')) fs.mkdirSync('./uploads');
if (!fs.existsSync('./outputs')) fs.mkdirSync('./outputs');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

function cutVideo(inputPath, duration, format, outputPath) {
  return new Promise((resolve, reject) => {

    let size;
    switch (format) {
      case '9:16': size = '720x1280'; break;
      case '1:1': size = '720x720'; break;
      default: size = '1280x720';
    }

    ffmpeg(inputPath)
      .setStartTime(0)
      .setDuration(duration)
      .size(size)
      .output(outputPath)
      .on('end', () => resolve(outputPath))
      .on('error', (err) => reject(err))
      .run();
  });
}

app.post('/create-shorts', upload.single('video'), async (req, res) => {
  try {
    const { duration, format, language } = req.body;

    const inputPath = req.file.path;
    const outputFile = `output-${Date.now()}.mp4`;
    const outputPath = `./outputs/${outputFile}`;

    await cutVideo(inputPath, duration, format, outputPath);

    res.json({
      success: true,
      url: `https://SEU-LINK-AQUI/outputs/${outputFile}`,
      language
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use('/outputs', express.static('outputs'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server rodando'));
