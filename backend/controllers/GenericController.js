const UploadImage = async (req, res) => {
    try {
      const baseUrl = "http://localhost:5000";
      if (!req.file) {
        return res.status(400).json({
          error: "Image file is required",
        });
      }
  
      const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
  
      res.status(200).json({ url: imageUrl });
    } catch (err) {
      console.log(err);
    }
  };
  
  module.exports = UploadImage;