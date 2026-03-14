import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const alreadyExist = await userModel.findOne({ email });
  if (alreadyExist) {
    return res.status(200).json({
      message: "User Exist..",
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

  res.status(200).json({
    message: "user Created..",
    token,
    user: {
      id: user._id,
      name,
      email,
    },
  });
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
