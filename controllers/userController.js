const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const { generateToken } = require("../extra/generateToken");
const { firebaseApp } = require("../config/firebase");
const {
  getAuth,
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} = require("firebase/auth");

const auth = getAuth(firebaseApp);
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await Users.findOne({ email });

    if (!result) {
      return res.status(401).json({
        success: false,
        message: `Invalid email or password`,
      });
    }

    const validatePwd = await bcrypt.compare(password, result.password);

    if (!validatePwd) {
      return res.status(401).json({
        success: false,
        message: `Invalid email or password`,
      });
    }

    // Assuming you're using Firebase for authentication
    await signInWithEmailAndPassword(auth, email, password);

    const user = auth.currentUser;

    if (!user) {
      return res.status(400).json({
        success: false,
        message: `No authenticated user found.`,
      });
    }

    const emailVerified = user.emailVerified;

    if (!emailVerified) {
      return res.status(403).json({
        success: false,
        message: `Email not verified. Please check your email for verification.`,
      });
    }

    // If everything is successful, return a success response
    res.status(200).json({
      success: true,
      message: `Login successful`,
      data: {
        ...result._doc,
        token: generateToken(result._id, result.role),
      },
    });
  } catch (err) {
    // Handle unexpected errors
    console.error(err);
    res.status(500).json({
      success: false,
      message: `Unable to login. Please try again later.`,
      err: err.message,
    });
  }
};

const register = async (req, res) => {
  const { firstName, lastName, email, password, phoneNumber, role } = req.body;
  const hashpwd = await bcrypt.hash(password, 10);
  if (!firstName || !lastName || !email || !password || !phoneNumber) {
    return res.status(401).json({
      message: "All fields are required",
    });
  }
  const duplicate = await Users.findOne({ email });
  if (duplicate) {
    return res.status(409).json({
      message: `email ${email} already has an account `,
    });
  }
  try {
    const newUser = new Users({
      firstName,
      lastName,
      email,
      password: hashpwd,
      phoneNumber,
      role: role || "client",
    });

    await newUser.save();
    const firebaseUser = await createUserWithEmailAndPassword(
      auth,
      newUser.email,
      password
    );
    newUser.firebasUid = firebaseUser.user.uid;
    await newUser.save();
    await sendEmailVerification(auth.currentUser);
    res.status(200).json({
      success: true,
      message:
        "User added successfully. Please check your email for verification.",
      token: generateToken(newUser._id, newUser.role),
      data: newUser,
    });
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      return res.status(409).json({
        success: false,
        message: `Email ${newUser.email} is already in use. Please log in or recover your account.`,
      });
    }

    res.status(400).json({
      success: false,
      message: "Error while trying to register a new user.",
      error: error.message,
    });
  }
};

const sendResetEmail = async (req, res) => {
  // Assume 'email' is the user's email address for which you want to reset the password
  const { email } = req.body;

  try {
    auth.languageCode = "it";
    await sendPasswordResetEmail(auth, email);
    res.status(200).json({
      success: true,
      message:
        "Password reset email sent successfully. Please check your email.",
    });
  } catch (error) {
    console.error("Error sending password reset email:", error.message);
    res.status(400).json({
      success: false,
      message: "Error sending password reset email.",
      error: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  let { oobCode, newPassword } = req.body;

  // If oobCode is not provided in the request body, try to extract it from the referer URL
  if (!oobCode) {
    const refererUrl = req.get("referer");

    if (refererUrl) {
      const url = new URL(refererUrl);
      oobCode = url.searchParams.get("oobCode");
    }
  }

  try {
    // If oobCode is still not available, respond with an error
    if (!oobCode) {
      return res.status(400).json({
        success: false,
        message: "No oobCode provided. Unable to reset password.",
      });
    }

    // Attempt to confirm the password reset and set the new password
    await confirmPasswordReset(auth, oobCode, newPassword);

    // If successful, respond with a success message
    res.status(200).json({
      success: true,
      message: "Password reset successful.",
    });
  } catch (error) {
    // If an error occurs during the password reset process, log the error and respond with an error message
    console.error("Error resetting password:", error.message);
    res.status(400).json({
      success: false,
      message: "Error resetting password.",
      error: error.message,
    });
  }
};

const getByID = async (req, res) => {
  const ID = req.params.ID;
  try {
    const result = await Users.findById(ID);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: ` user not found ${ID} `,
        err: err.message,
      });
    }
    res.status(200).json({
      success: true,
      message: `get user by id ${ID} succesfully`,
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `unable to get data by id ${ID} `,
      err: err.message,
    });
  }
};
const getAll = async (req, res) => {
  try {
    //remove {}
    const result = await Users.find();
    if (!Array.isArray(result))
      return res.status(400).json({
        success: false,
        message: `no data found`,
        data: result,
      });
    res.status(200).json({
      success: true,
      message: `get all users succesfully`,
      data: result,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: `unable to get all users succesfully`,
      err: err.message,
    });
  }
};
const deleteById = async (req, res) => {
  const ID = req.params.ID;
  try {
    const result = await Users.deleteOne({ _id: ID });
    res.status(200).json({
      success: true,
      message: `delete user with id ${ID} successfully`,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: `unable to delete user ${ID}`,
      err: err.message,
    });
  }
};

const update = async (req, res) => {
  const ID = req.params.ID;

  try {
    const { firstName, lastName, email, password, phoneNumber, role } =
      req.body;

    const result = await Users.findByIdAndUpdate(
      ID,
      {
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        role,
      },
      { new: true } // Return the updated document
    );

    res.status(200).json({
      success: true,
      message: `update with id ${ID} successfully`,
      data: result,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: `unable to update id ${ID}`,
      err: err.message,
    });
  }
};
module.exports = {
  register,
  getByID,
  getAll,
  deleteById,
  update,
  login,
  sendResetEmail,
  resetPassword,
};