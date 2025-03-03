const User = require("../model/User");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
    try {
      const { name, phone, address } = req.body;
      const userId = req.params.userId;
  
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      let imageUrl = user.image; 
      if (req.file) {
        imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
      }
  
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { name, phone, address, image: imageUrl },
        { new: true }
      );
  
      res.json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
exports.uploadProfileImage = async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  
      const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
      const userId = req.params.userId;
  
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { image: imageUrl },
        { new: true }
      );
  
      res.json({ message: "Profile image updated successfully", user: updatedUser });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  