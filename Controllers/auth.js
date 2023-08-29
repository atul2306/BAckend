const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const async = require("async");
const emailValidator = require("email-validator");
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};

module.exports.auth_signup_controller = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({
        message: "Please fill all the fields",
        ok: false,
      });
    }
    if (password.length < 6) {
      return res.json({
        message: "Password not Strong (Should be atleast 6 Character)",
        ok: false,
      });
    }
    if (!emailValidator.validate(email)) {
      return res.json({
        message: "Email not Valid ",
        ok: false,
      });
    }
    const existingUser = await User.findOne({ email: email });
    if (existingUser)
      return res.json({
        message: "User Already Registered, Please Login",
        ok: false,
      });
    const hashed_Pass = await bcrypt.hash(password, 10);
    const user = await new User({
      name,
      email,
      password: hashed_Pass,
      confirmed: true,
    });
    await user.save();

    return res.status(201).json({
      message: "SignUp Confirmed , Please Login",
      ok: true,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports.auth_signin_controller = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({
        message: "Please fill all the fields",
        ok: false,
      });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.json({
        message: "Email Not Registered or Password is Wrong",
        ok: false,
      });
    }

    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.json({ ok: false, message: "Email Not Registered or Password is Wrong" });
    }

     
    
      const token = createToken(user._id);
      const userDetails = {
        userId: user._id,
        userName: user.name,
        userEmail: user.email,
      };
      return res.status(201).json({
        userDetails,
        token,
        ok: true,
        message: "Logged In Successfully",
      });
    
  } catch (err) {
    console.log(err);
  }
};
