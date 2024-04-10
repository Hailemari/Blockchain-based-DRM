const express = require('express');
const File = require('../models/file');
const upload = require('../middleware/uploadMiddleware');
const router = express.Router();

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send('No file uploaded.');
      }
      // Extract metadata from the request body, including the new fileDescription
      const { filename, fileDescription, ownerName, dateCreated, price } = req.body;
      const newFile = new File({
        filename,
        fileDescription, // Save the file description
        ownerName,
        dateCreated: new Date(dateCreated),
        price: parseFloat(price),
        contentType: req.file.mimetype,
        data: req.file.buffer.toString('base64')
      });
  
      await newFile.save();
      res.status(201).send({ message: 'File uploaded successfully', fileId: newFile._id });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error uploading file to database');
    }
  });
  
  module.exports = router;