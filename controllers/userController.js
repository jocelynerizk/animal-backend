const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const { generateToken } = require('../extra/generateToken');
const { getAuth, confirmPasswordReset, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, isEmailVerified, sendPasswordResetEmail } = require('firebase/auth');
const auth = getAuth();


const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await Users.findOne({ email });
    if (!result) {
      res.status(400).json({
        success: false,
        message: `User with email ${email} not found`,
      });
    }

    const validatePwd = await bcrypt.compare(password, result.password);
   
    if (!validatePwd) {
      return res.status(400).json({
        success: false,
        message: `password is  wrong`,
      });
    }

    await signInWithEmailAndPassword(auth, email, password);
      const currentUser = auth.currentUser;

      if (!currentUser) {
          return res.status(400).json({
              success: false,
              message: `No authenticated user found.`,
          });
      }

      if (!currentUser.emailVerified) {
          return res.status(400).json({
              success: false,
              message: `Email not verified. Please check your email for verification.`,
          });
      }

   
    res.status(200).json({
      success: true,
      message: `login successfully`,
      data: {
        ...result._doc,
        token: generateToken(result._id, result.role)
      },
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: `unable to login`,
      err:err.message,
    });
  }
};

const register = async (req, res) => {
  const {
    fullName,
    email,
    password,
    phoneNumber,
    chambrecommerce,
    vatnumb,
    fullAddress,
    role
  } = req.body;
  const hashpwd = await bcrypt.hash(password, 10);

  if (!fullName || !email || !password || !phoneNumber) {
    return res.status(401).json({
      message: "All fields are required"
    });
  }

  const duplicate = await Users.findOne({
    email
  });

  if (duplicate) {
    return res.status(409).json({
      message: `email ${email} already has an account `
    });
  }

  try {
    const newUser = new Users({
      fullName: {
        firstName: fullName.firstName,
        lastName: fullName.lastName,
      },
      email,
      password: hashpwd,
      phoneNumber,
      city,
      chambrecommerce,
      vatnumb,
      fullAddress: {
        long: fullAddress.long,
        lat: fullAddress.lat,
        dept: fullAddress.dept,
        caza: fullAddress.caza,
        region: fullAddress.region,
      },
      role: role || "company",
    });

    await newUser.save();

    const firebaseUser = await createUserWithEmailAndPassword(auth, newUser.email, password);

    newUser.firebaseUid = firebaseUser.user.uid;
    await newUser.save();

    await sendEmailVerification(auth.currentUser);

    res.status(200).json({
      success: true,
      message: 'User added successfully. Please check your email for verification.',
      token: generateToken(newUser._id, newUser.role),
      data: newUser,
    });
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      return res.status(409).json({
        success: false,
        message: `Email ${newUser.email} is already in use. Please log in or recover your account.`,
      });
    }

    res.status(400).json({
      success: false,
      message: 'Error while trying to register a new user.',
      error: error.message,
    });
  }
};

const sendResetEmail = async (req, res) => {
  const {
    email
  } = req.body;

  try {
    await sendPasswordResetEmail(auth, email);
    res.status(200).json({
      success: true,
      message: 'Password reset email sent successfully. Please check your email.',
    });
  } catch (error) {
    console.error('Error sending password reset email:', error.message);
    res.status(400).json({
      success: false,
      message: 'Error sending password reset email.',
      error: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  let { oobCode, newPassword } = req.body;

  if (!oobCode) {
    const refererUrl = req.get('referer'); 

    if (refererUrl) {
      const url = new URL(refererUrl);
      oobCode = url.searchParams.get('oobCode');
    }
  }

  try {
    if (!oobCode) {
      return res.status(400).json({
        success: false,
        message: 'No oobCode provided. Unable to reset password.',
      });
    }

    await confirmPasswordReset(auth, oobCode, newPassword);
    res.status(200).json({
      success: true,
      message: 'Password reset successful.',
    });
  } catch (error) {
    console.error('Error resetting password:', error.message);
    res.status(400).json({
      success: false,
      message: 'Error resetting password.',
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
    const result = await Users.find({});
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
    const result = await Users.deleteOne({ ID });
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
    const { fullName, ...updateData } = req.body;
    
        if (fullName) {
          updateData.fullName = {
            firstName: fullName.split(" ")[0],
            lastName: fullName.split(" ")[1],
          };
        }

    const result = await Users.findByIdAndUpdate(ID,updateData);
     
    res.status(200).json({
      success: true,
      message: `update with id ${ID} successfully`,
      data: result,
    });
  } catch (err) {
    return res.status(400).json({
      success: true,
      message: `unable to update id ${ID}`,
      data: result,
    });
  }
};

module.exports = { register, getByID, getAll, deleteById, update, login, sendResetEmail, resetPassword };
