const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../modal/User");

const register = async (req, res) => {
  console.log(req.body);
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "All fields required" });
  const ExistingUser = User.find({ username });
  if (ExistingUser) {
    res.status(401).json({ eroor: "This username is not available" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword });
  try {
    await user.save();
    res.status(200).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error registering user" });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  console.log("username", username, "and pasww:", password);
  if (!username || !password)
    return res.status(400).json({ error: "All fields required" });

  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

  const AuthToken = jwt.sign(
    { username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.status(200).json({ AuthToken });
};
const verifyToken = (req, res) => {
  const token = req.body.AuthToken; 
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return res.status(200).json({ user:req.user.username });
    
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};
const forgetPass = async (req, res) => {
  try {
    const { username, oldPassword, newPassword } = req.body;
    if (!username || !oldPassword || !newPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect old password" });
    }

    // Update the password in the database
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Error updating password:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { register, login, verifyToken,forgetPass };