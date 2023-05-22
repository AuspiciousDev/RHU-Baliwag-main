const User = require("../model/User");
const LoginHistory = require("../model/LoginHistory");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const createToken = require("../helper/createToken");
const sendMail = require("../helper/sendMail");
const generateCredential = require("../helper/generateCredential");
const ROLES_LIST = require("../config/role_list");
const isEmail = (str) =>
  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(str);
const isNumber = (str) => /^[0-9]*$/.test(str);
const authController = {
  handleLogin: async (req, res) => {
    try {
      // * Get username and password from client request body
      const { username, password } = req.body;
      // * Check if the username exists in the User collection
      const foundUser = await User.findOne({ username }).exec();
      if (!foundUser) {
        return res
          .status(401)
          .json({ message: "Invalid Username or Password" });
      }
      // * Check if found user status is active or inactive
      if (foundUser?.status === false) {
        return res
          .status(401)
          .json({ message: "Your account has been disabled!" });
      } else {
        // * Check if the password provided by the user matches
        const passwordMatched = await bcrypt.compare(
          password,
          foundUser.password
        );
        // * Create JWT if password matched
        if (passwordMatched) {
          const loginObject = { username };
          const newLogin = await LoginHistory.create(loginObject);
          console.log(
            "🚀 ~ file: authController.js:34 ~ handleLogin: ~ newLogin",
            newLogin
          );
          const userObject = {
            UserInfo: {
              username: foundUser.username,
              userType: foundUser.userType,
            },
          };

          const firstName = foundUser.firstName;
          const lastName = foundUser.lastName;
          const imgURL = foundUser.imgURL;
          const accessToken = createToken.access(userObject);
          const refreshToken = createToken.refresh({
            username: foundUser.username,
          });

          // * Save refresh token to Found user
          foundUser.refreshToken = refreshToken;
          const result = await foundUser.save();
          console.log(
            "🚀 ~ file: authController.jsx:38 ~ handleLogin: ~ result",
            result
          );

          // * Create a HttpOnly cookie
          res.cookie("jwt", refreshToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
          });
          // * Send response back to client
          res.json({
            username,
            userType: foundUser.userType,
            accessToken,
            firstName,
            lastName,
            imgURL,
          });
        } else {
          res.status(401).json({ message: "Invalid Username/Password!" });
        }
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: authController.js:83 ~ handleLogin: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  // * Activate User
  activateDoc: async (req, res) => {
    try {
      const { activation_token } = req.body;
      const user = await jwt.verify(
        activation_token,
        process.env.ACTIVATION_TOKEN_SECRET
      );

      const {
        username,
        password,
        firstName,
        middleName,
        lastName,
        gender,
        email,
        userType,
        dateOfBirth,
        address,
        city,
        province,
        mobile,
      } = user;
      const hashedPassword = await bcrypt.hash(password, 10);
      const checkUser = await User.findOne({ username, email });
      if (checkUser)
        return (
          res
            .status(400)
            // .json({ message: `${checkUser}` });
            .json({ message: "This User/email is already registered!" })
        );
      const newUser = new User({
        username,
        password: hashedPassword,
        firstName,
        middleName,
        lastName,
        gender,
        email,
        userType,
        dateOfBirth,
        address,
        city,
        province,
        mobile,
      });
      await newUser.save();
      res.status(200).json({
        message: "Your account has been activated!, You can now sign in!",
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
      console.log(error);
    }
  },
  forgotPassword: async (req, res) => {
    let emptyFields = [];
    try {
      // * Get email
      const { email } = req.body;
      if (!email) emptyFields.push("Email is required");
      if (!isEmail(email)) emptyFields.push("Invalid email");

      if (emptyFields.length > 0)
        return res
          .status(400)
          .json({ message: "Please fill in all the fields", emptyFields });
      // * Check email
      const user = await User.findOne({ email });
      if (!user)
        return res.status(400).json({ message: "This email does not exists!" });
      if (user?.status === false) {
        return res.status(401).json({
          message: "Your account has been disabled!",
        });
      }
      // * Create access token
      const accessToken = createToken.access({ username: user.username });

      //send email
      const url = `${process.env.BASE_URL}/#/auth/reset-password/${accessToken}`;
      const name = user.username;
      sendMail.sendEmailReset(email, url, "Reset your password", name);

      //success
      res.status(200).json({
        message:
          "Password reset token has been sent, Please check your inbox or spam email.",
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
      console.log(error);
    }
  },
  resetPassword: async (req, res) => {
    try {
      // * Get password
      const { password } = req.body;
      if (!password)
        return res.status(400).json({ message: "Password is required" });

      // * Hash password
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);
      // * Update password
      const foundUser = await User.findOne({
        username: req.user.username,
      }).exec();
      if (!foundUser)
        return res.status(404).json({ message: "Invalid Username/Password!" }); //Unauth
      const compareOldNew = await bcrypt.compare(password, foundUser.password);
      if (compareOldNew)
        return res.status(400).json({
          message: `Current and New password is just the same!, Use a new password instead.`,
        });
      await User.findOneAndUpdate(
        {
          username: req.user.username,
        },
        {
          password: hashPassword,
        }
      );
      //reset success
      res.status(200).json({ message: "Password reset successfully!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
      console.log(error);
    }
  },
  verifyPassword: async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd)
      return res
        .status(400)
        .json({ message: "Username and Password are required" });

    const foundUser = await User.findOne({ username: user }).exec();
    if (!foundUser)
      return res.status(401).json({ message: "Invalid Username/Password!" }); //Unauth
    if (foundUser?.status === false) {
      return res
        .status(401)
        .json({ message: "Your account has been disabled!" }); //Unauth
    }
    //evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
      return res.status(200).json({ message: "Confirm" });
    } else {
      res.status(401).json({ message: "Invalid Username/Password!" });
    }
  },
  changePassword: async (req, res) => {
    try {
      const { username, password, newPassword } = req.body;
      if (!username) res.status(400).json({ message: "Username is required" });
      if (!password) res.status(400).json({ message: "Password is required" });
      if (!newPassword)
        res.status(400).json({ message: "Password is required" });

      const foundUser = await User.findOne({ username }).exec();
      if (!foundUser)
        return res.status(404).json({ message: "Invalid Username/Password!" }); //Unauth
      // return res.status(401).json({ message: "Username not found" }); //Unauth
      const compareOldNew = await bcrypt.compare(
        newPassword,
        foundUser.password
      );
      if (compareOldNew)
        return res.status(400).json({
          message: `Current and new password is just the same!, Use a different password instead.`,
        });
      const match = await bcrypt.compare(password, foundUser.password);
      if (match) {
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(newPassword, salt);

        const update = await User.findOneAndUpdate(
          {
            username: username,
          },
          {
            password: hashPassword,
          }
        );
        if (update)
          return res
            .status(200)
            .json({ message: "Password changed successfully!" });
      } else {
        res.status(400).json({ message: "Password does not matched!" });
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: AuthController.js:184 ~ changePassword: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },

  publicCreate: async (req, res) => {
    let emptyFields = [];
    let genUsername;
    try {
      const {
        username,
        userType,
        firstName,
        middleName,
        lastName,
        gender,
        email,
        dateOfBirth,
        address,
        city,
        province,
        mobile,
      } = req.body;
      if (!username) {
        genUsername = generateCredential.username(10);
      } else {
        if (username?.length != 10)
          emptyFields.push("User ID must be 10 Digits!");
        if (!isNumber(username)) emptyFields.push("User ID must be a digit");
        genUsername = username;
      }
      if (!userType) emptyFields.push("User Type");
      if (!ROLES_LIST.includes(userType)) emptyFields.push("Invalid User Type");
      if (!email) emptyFields.push("Email");
      if (!isEmail(email)) emptyFields.push("Invalid email");
      if (!firstName) emptyFields.push("First Name");
      if (!lastName) emptyFields.push("Last Name");
      if (!gender) emptyFields.push("Gender");
      if (!dateOfBirth) emptyFields.push("Birthday");

      if (emptyFields.length > 0)
        return res
          .status(400)
          .json({ message: "Please fill in all the fields", emptyFields });

      const duplicateID = await User.findOne({ username }).exec();
      if (duplicateID)
        return res.status(409).json({ message: "Username Already Exists!" });

      const duplicateEmail = await User.findOne({ email }).exec();
      if (duplicateEmail)
        return res.status(409).json({ message: "Email Already Exists!" });

      const genPassword = generateCredential.password(10);

      const docObject = {
        username: genUsername,
        password: genPassword,
        firstName,
        middleName,
        lastName,
        gender,
        email,
        mobile,
        userType,
        dateOfBirth,
        address,
        city,
        province,
      };
      const activationToken = createToken.activation(docObject);
      const url = `${process.env.BASE_URL}/#/auth/activate/${activationToken}`;
      sendMail.sendNewUser(
        email,
        url,
        "Verify your account",
        genUsername,
        genPassword,
        userType
      );
      res.status(200).json({
        message:
          "A verification has been sent to user email, Please check email's inbox or spam mail.",
      });
    } catch (error) {
      console.log(
        "🚀 ~ file: userController.js:110 ~ createDoc: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
};
module.exports = authController;
