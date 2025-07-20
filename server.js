const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 5500;
const CART_FILE = path.join(__dirname, "/data/cart.json");

const SUBMISSIONS_FILE = path.join(__dirname, "/data/submissions.json");

app.use(cors());
app.use(bodyParser.json());

// Helper function to read submissions from JSON file
function readSubmissions() {
  try {
    let data = fs.readFileSync(SUBMISSIONS_FILE);
    return JSON.parse(data).submissions;
  } catch (error) {
    return [];
  }
}

function writeSubmissions(submissions) {
  const dir = path.dirname(SUBMISSIONS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify({ submissions }, null, 4));
}

// Route to store form submissions
app.post("/store_submission", (req, res) => {
  const { name, email, subject, message, timestamp } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  let submissions = readSubmissions();
  submissions.push({ name, email, subject, message, timestamp });

  writeSubmissions(submissions);
  res.json({ message: "Submission stored successfully!" });
});

// Route to get all submissions
app.get("/submissions", (req, res) => {
  res.json(readSubmissions());
});

// Helper function to read cart from JSON file
function readCart() {
  try {
    let data = fs.readFileSync(CART_FILE);
    return JSON.parse(data).cart;
  } catch (error) {
    return [];
  }
}

// Helper function to write cart to JSON file
function writeCart(cart) {
  fs.writeFileSync(CART_FILE, JSON.stringify({ cart }, null, 4));
}

// Route to get all cart items
app.get("/cart", (req, res) => {
  res.json(readCart());
});

// Route to add an item to the cart
app.post("/add_to_cart", (req, res) => {
  const { name, price } = req.body;
  if (!name || !price) {
    return res.status(400).json({ message: "Invalid item details" });
  }

  let cart = readCart();
  let existingItem = cart.find((item) => item.name === name);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }

  writeCart(cart);
  res.json({ message: `${name} added to cart!`, cart });
});

// Route to update item quantity (+ or -)
app.post("/update_quantity", (req, res) => {
  const { name, change } = req.body;
  let cart = readCart();

  let item = cart.find((item) => item.name === name);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      cart = cart.filter((item) => item.name !== name); // Remove if quantity reaches 0
    }
  }

  writeCart(cart);
  res.json({ message: "Quantity updated!", cart });
});

// Clear the cart
app.delete("/cart", (req, res) => {
  writeCart([]);
  res.json({ message: "Cart cleared!" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
