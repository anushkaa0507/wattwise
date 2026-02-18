const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const users = []; // later move to DB

const SECRET = "wattwise-secret";

// SIGNUP
exports.signup = async (req, res) => {
  const { email, password } = req.body;

  const existing = users.find((u) => u.email === email);
  if (existing) return res.status(400).json({ message: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);

  const user = {
    id: Date.now().toString(),
    email,
    password: hashed,
  };

  users.push(user);

  res.json({ message: "Signup successful" });
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);
  if (!user) return res.status(400).json({ message: "Invalid email" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: "Invalid password" });

  const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "1d" });

  res.json({ token });
};
