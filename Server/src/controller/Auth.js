const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../modal/User");

const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });

    await user.save();

    return res.json({ message: "User registered successfully" }); // ✅ Added return to prevent duplicate responses
  } catch (err) {
    console.error("Error registering user:", err);
    return res.status(500).json({ error: "Error registering user" }); // ✅ Ensures only one response is sent
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "All fields required" });

  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: "No user exist with this name" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

  const AuthToken = jwt.sign(
    { username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.status(200).json({ AuthToken,username });
};
const verifyToken = (req, res) => {
  const token = req.header("AuthToken");
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return res.status(200).json({ username: req.user.username });
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

module.exports = { register, login, verifyToken };
