import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";

const app = express();

app.use(cors());
app.use(express.json());

/* ───────────────────────────────
   MongoDB Connection
─────────────────────────────── */
mongoose
  .connect(
    "mongodb+srv://thriftshop:xOHI8TzyHgr6gAu3@thriftshop.zqhyw5s.mongodb.net/thriftshop?retryWrites=true&w=majority"
  )
  .then(() => console.log("🔥 MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

/* ───────────────────────────────
   USER MODEL
─────────────────────────────── */
const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: { type: String, unique: true },
  password: String,

  role: {
    type: String,
    enum: ["customer", "admin"],
    default: "customer",
  },
});

const User = mongoose.model("User", userSchema);

/* ───────────────────────────────
   LOGIN HISTORY MODEL
─────────────────────────────── */
const loginSchema = new mongoose.Schema({
  email: String,
  loginTime: {
    type: Date,
    default: Date.now,
  },
});

const Login = mongoose.model("Login", loginSchema);

/* ───────────────────────────────
   PRODUCT MODEL (IMPORTANT FIX)
─────────────────────────────── */
const productSchema = new mongoose.Schema({
  id: String,
  name: String,
  price: Number,
  originalPrice: Number,
  category: String,
  description: String,
  condition: String,
  size: String,
  imageUrl: String,
  featured: Boolean,
});

const Product = mongoose.model("Product", productSchema);

/* ───────────────────────────────
   TEST ROUTE
─────────────────────────────── */
app.get("/", (req, res) => {
  res.send("🚀 Server OK");
});

/* ───────────────────────────────
   USERS
─────────────────────────────── */
app.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

/* ───────────────────────────────
   SIGNUP
─────────────────────────────── */
app.post("/signup", async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ message: "Мэдээлэл бүрэн оруулна уу" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email бүртгэлтэй байна" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      first_name,
      last_name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.json({
      message: "✅ Амжилттай бүртгэгдлээ",
    
      data: "fake-token",
    
      user: {
        id: newUser._id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ───────────────────────────────
   LOGIN
─────────────────────────────── */
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Мэдээлэл бүрэн оруулна уу" });
    }

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({
        message: "Email олдсонгүй",
      });
    }
    
    if (user.role === "admin") {
      return res.status(400).json({
        message: "Та admin хэрэглэгч байна",
        success: false,
      });
    }
    if (!user) {
      return res.status(400).json({ message: "Email олдсонгүй" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Нууц үг буруу" });
    }

    await new Login({ email: user.email }).save();

    res.json({
      message: "✅ Амжилттай нэвтэрлээ",
      data: user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Мэдээлэл бүрэн оруулна уу",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Email олдсонгүй",
      });
    }

    // зөвхөн admin хэрэглэгч нэвтэрнэ
    if (user.role !== "admin") {
      return res.status(400).json({
        message: "Admin хэрэглэгч биш байна",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Нууц үг буруу",
      });
    }

    await new Login({ email: user.email }).save();

    res.json({
      message: "✅ Амжилттай нэвтэрлээ",
      success: true,
      data: user,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

/* ───────────────────────────────
   LOGIN HISTORY
─────────────────────────────── */
app.get("/logins", async (req, res) => {
  try {
    const logins = await Login.find().sort({ loginTime: -1 });
    res.json(logins);
  } catch (err) {
    res.status(500).json(err);
  }
});

/* ───────────────────────────────
   PRODUCTS API (FIXED + NEW)
─────────────────────────────── */

// GET all products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD product
app.post("/products", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.json(newProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE product
app.delete("/products/:id", async (req, res) => {
  try {
    await Product.findOneAndDelete({ id: req.params.id });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ───────────────────────────────
   UPDATE PRODUCT
─────────────────────────────── */

app.put("/products/:id", async (req, res) => {
  try {
    const updatedProduct =
      await Product.findOneAndUpdate(
        { id: req.params.id },
        req.body,
        { new: true }
      );

    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});
  
/* ───────────────────────────────
   START SERVER
─────────────────────────────── */
app.listen(8080, () => {
  console.log("🔥 http://localhost:8080");
});