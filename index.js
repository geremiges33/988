import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";

const app = express();

/* ───────────────────────────────
   MIDDLEWARE
─────────────────────────────── */
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

/* ───────────────────────────────
   DB CONNECTION
─────────────────────────────── */
mongoose
  .connect(
    "mongodb+srv://thriftshop:xOHI8TzyHgr6gAu3@thriftshop.zqhyw5s.mongodb.net/thriftshop?retryWrites=true&w=majority"
  )
  .then(() => console.log("🔥 MongoDB connected"))
  .catch((err) => console.log(err));

/* ───────────────────────────────
   USER MODEL
─────────────────────────────── */
const userSchema = new mongoose.Schema(
  {
    first_name: String,

    last_name: String,

    email: {
      type: String,
      unique: true,
    },

    password: String,

    role: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer",
    },

    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    cart: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },

        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

/* ───────────────────────────────
   LOGIN LOG
─────────────────────────────── */
const loginSchema = new mongoose.Schema(
  {
    email: String,
    loginTime: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Login = mongoose.model("Login", loginSchema);

/* ───────────────────────────────
   PRODUCT MODEL
─────────────────────────────── */
const productSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);

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
  const users = await User.find().select("-password");
  res.json(users);
});

/* ───────────────────────────────
   SIGNUP
─────────────────────────────── */
app.post("/signup", async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ message: "Мэдээлэл дутуу" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email бүртгэлтэй" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role: "customer",
    });

    await user.save();

    res.json({
      message: "✅ Амжилттай бүртгэгдлээ",
      user: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ───────────────────────────────
   LOGIN (CUSTOMER)
─────────────────────────────── */
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User олдсонгүй" });
    }

    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
      return res.status(400).json({ message: "Нууц үг буруу" });
    }

    // 🚫 зөвхөн customer login
    if (user.role !== "customer") {
      return res.status(403).json({
        message: "Энэ аккаунт нь customer аккаунт биш байна",
      });
    }

    await new Login({ email }).save();

    res.json({
      message: "✅ Login OK",
      user: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ───────────────────────────────
   ADMIN LOGIN
─────────────────────────────── */
app.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User олдсонгүй" });
    }

    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
      return res.status(400).json({ message: "Нууц үг буруу" });
    }

    // 🚫 зөвхөн admin
    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Энэ аккаунт нь admin аккаунт биш байна",
      });
    }

    await new Login({ email }).save();

    res.json({
      message: "✅ Admin OK",
      user: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ───────────────────────────────
   PRODUCTS
─────────────────────────────── */
app.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.post("/products", async (req, res) => {
  const product = new Product(req.body);
  await product.save();

  res.json({
    message: "✅ Product нэмэгдлээ",
    product,
  });
});

app.put("/products/:id", async (req, res) => {
  const updated = await Product.findOneAndUpdate(
    { id: req.params.id },
    req.body,
    { new: true }
  );

  res.json(updated);
});

app.delete("/products/:id", async (req, res) => {
  await Product.findOneAndDelete({ id: req.params.id });

  res.json({ message: "✅ Deleted" });
});

app.post("/favorites", async (req, res) => {
  const { userId, productId } = req.body;

  const user = await User.findById(userId);

  const exists = user.favorites.some(
    (id) => id.toString() === productId
  );

  if (exists) {
    user.favorites = user.favorites.filter(
      (id) => id.toString() !== productId
    );
  } else {
    user.favorites.push(productId);
  }

  await user.save();

  const updated = await user.populate("favorites");
  res.json(updated.favorites);
});

app.delete("/favorites/remove", async (req, res) => {
  const { userId, productId } = req.body;

  const user = await User.findById(userId);

  if (!user) return res.status(404).json({ message: "User not found" });

  user.favorites = user.favorites.filter(
    (id) => id.toString() !== productId
  );

  await user.save();

  res.json(user.favorites);
});

app.get("/favorites/:userId", async (req, res) => {
  const user = await User.findById(req.params.userId)
    .populate("favorites");

  res.json(user.favorites);
});

app.post("/cart", async (req, res) => {
  console.log("CART HIT:", req.body);
  const { userId, productId } = req.body;

  const user = await User.findById(userId);

  const existing = user.cart.find(
    (item) => item.product.toString() === productId
  );

  if (existing) {
    existing.quantity += 1;
  } else {
    user.cart.push({
      product: productId,
      quantity: 1,
    });
  }

  await user.save();

  res.json(user.cart);
});

app.get("/cart/:userId", async (req, res) => {
  const user = await User.findById(req.params.userId)
    .populate("cart.product");

  res.json(user.cart);
});

/* ───────────────────────────────
   START SERVER
─────────────────────────────── */
app.listen(8080, () => {
  console.log("🔥 http://localhost:8080");
});