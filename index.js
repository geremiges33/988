import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://thriftshop:xOHI8TzyHgr6gAu3@thriftshop.zqhyw5s.mongodb.net/thriftshop?retryWrites=true&w=majority")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Schema
const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  age: Number,
  email: { type: String, unique: true },
  password: String,
});

const User = mongoose.model("User", userSchema);

const loginSchema = new mongoose.Schema({
  email: String,
  loginTime: {
    type: Date,
    default: Date.now
  }
});

const Login = mongoose.model("Login", loginSchema);
// TEST
app.get("/", (req, res) => {
  res.send("🚀 Server OK");
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});



// SIGNUP
app.post("/signup", async (req, res) => {
  try {
    const { first_name, last_name, age, email, password } = req.body;

    if (!first_name || !last_name || !age || !email || !password) {
      return res.status(400).json({
        message: "Мэдээлэл бүрэн оруулна уу"
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email бүртгэлтэй байна"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      first_name,
      last_name,
      age,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.json({
      message: "✅ Амжилттай бүртгэгдлээ"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Мэдээлэл бүрэн оруулна уу"
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Email олдсонгүй"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Нууц үг буруу"
      });
    }

    // 🔥 ЭНД login history хадгална
    const loginRecord = new Login({
      email: user.email
    });

    await loginRecord.save();

    res.json({
      message: "✅ Амжилттай нэвтэрлээ",
      data: user
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/logins", async (req, res) => {
  try {
    const logins = await Login.find().sort({ loginTime: -1 });
    res.json(logins);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.listen(8080, () => {
  console.log("🔥 http://localhost:8080");
});