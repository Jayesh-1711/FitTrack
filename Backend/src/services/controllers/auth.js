import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const alreadyExist = await userModel.findOne({ email });
    if (alreadyExist) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET
    );

    res.cookie("token", token);

    res.status(201).json({
      message: "User created",
      token,
      user: {
        id: user._id,
        name,
        email,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
const Login = async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(404).json({
      message: "invalid email",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(404).json({
      message: "invalid Password..",
    });
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET
  );

  res.cookie("token", token);

  return res.status(200).json({
    message: "login hogya mittar",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};

const LogOut = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({
    message: "logged out Successfull..",
  });
};

export default {
  register,
  Login,
  LogOut,
};
