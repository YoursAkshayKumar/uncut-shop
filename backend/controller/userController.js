const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { generateToken } = require("../utils/token");
const { sendEmail } = require("../config/email");
const { tokenForVerify } = require("../utils/token");
const { secret } = require("../config/secret");

// sign up
module.exports.signup = async (req, res,next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(409).send({ 
        status: "failed", 
        message: "This email is already registered. If you have forgotten your password, please go to password reset to change it.",
        code: "EMAIL_EXISTS"
      });
    } else {
      const saved_user = await User.create(req.body);
      const verificationCode = saved_user.generateVerificationCode();

      await saved_user.save({ validateBeforeSave: false });

      const mailData = {
        from: secret.email_user,
        to: `${req.body.email}`,
        subject: "Verify Your Email - Uncut Designs",
        html: `<h2>Hello ${req.body.name}</h2>
        <p>Verify your email address to complete the signup and login into your <strong>Uncut Designs</strong> account.</p>
  
          <p>Your verification code is: <strong style="font-size: 24px; color: #22c55e; letter-spacing: 3px;">${verificationCode}</strong></p>
  
          <p>This code will expire in <strong>15 minutes</strong>.</p>
  
          <p style="margin-top: 35px;">If you did not initiate this request, please contact us immediately at support@uncutdesign.com</p>
  
          <p style="margin-bottom:0px;">Thank you</p>
          <strong>Uncut Designs Team</strong>
           `,
      };
      const message = "Please check your email for the verification code!";
      sendEmail(mailData, res, message);
    }
  } catch (error) {
    console.log('sign up err',error);
    next(error)
  }
};

/**
 * 1. Check if Email and password are given 
 * 2. Load user with email
 * 3. if not user send res
 * 4. compare password
 * 5. if password not correct send res
 * 6. check if user is active
 * 7. if not active send res
 * 8. generate token
 * 9. send user and token
 */
module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        status: "fail",
        error: "Please provide your credentials",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        status: "fail",
        error: "No user found. Please create an account",
      });
    }

    const isPasswordValid = user.comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(403).json({
        status: "fail",
        error: "Password is not correct",
      });
    }

    if (user.status != "active") {
      return res.status(401).json({
        status: "fail",
        error: "Your account is not active yet.",
      });
    }

    const token = generateToken(user);

    const { password: pwd, ...others } = user.toObject();

    res.status(200).json({
      status: "success",
      message: "Successfully logged in",
      data: {
        user: others,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error,
    });
  }
};

// get me
module.exports.getMe = async (req, res) => {
  try {
    const user = await User.findOne({ email: req?.user?.email });
    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error,
    });
  }
};
// verifyCode - verify email with code
module.exports.verifyCode = async (req, res, next) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        status: "fail",
        error: "Email and verification code are required",
      });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({
        status: "fail",
        error: "User not found",
      });
    }

    if (!user.verificationCode) {
      return res.status(403).json({
        status: "fail",
        error: "No verification code found. Please register again.",
      });
    }

    if (user.verificationCode !== code) {
      return res.status(403).json({
        status: "fail",
        error: "Invalid verification code",
      });
    }

    const expired = new Date() > new Date(user.verificationCodeExpires);

    if (expired) {
      return res.status(401).json({
        status: "fail",
        error: "Verification code expired. Please request a new one.",
      });
    }

    // Activate user account
    user.status = "active";
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;

    await user.save({ validateBeforeSave: false });

    const accessToken = generateToken(user);

    const { password: pwd, ...others } = user.toObject();

    res.status(200).json({
      status: "success",
      message: "Successfully verified your email and activated your account.",
      data: {
        user: others,
        token: accessToken,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// confirmEmail
module.exports.confirmEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ confirmationToken: token });

    if (!user) {
      return res.status(403).json({
        status: "fail",
        error: "Invalid token",
      });
    }

    const expired = new Date() > new Date(user.confirmationTokenExpires);

    if (expired) {
      return res.status(401).json({
        status: "fail",
        error: "Token expired",
      });
    }

    user.status = "active";
    user.confirmationToken = undefined;
    user.confirmationTokenExpires = undefined;

    user.save({ validateBeforeSave: false });

    const accessToken = generateToken(user);

    const { password: pwd, ...others } = user.toObject();

    res.status(200).json({
      status: "success",
      message: "Successfully activated your account.",
      data: {
        user: others,
        token: accessToken,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "fail",
      error,
    });
  }
};

// forgetPassword
module.exports.forgetPassword = async (req, res, next) => {
  try {
    const { verifyEmail } = req.body;
    const user = await User.findOne({ email: verifyEmail });
    if (!user) {
      return res.status(404).send({
        status: "fail",
        message: "User Not found with this email!",
      });
    } else {
      const verificationCode = user.generatePasswordResetVerificationCode();
      await user.save({ validateBeforeSave: false });

      const body = {
        from: secret.email_user,
        to: `${verifyEmail}`,
        subject: "Password Reset - Uncut Designs",
        html: `<h2>Hello ${user.name || verifyEmail}</h2>
        <p>A request has been received to change the password for your <strong>Uncut Designs</strong> account </p>

        <p>Your verification code is: <strong style="font-size: 24px; color: #22c55e; letter-spacing: 3px;">${verificationCode}</strong></p>

        <p>This code will expire in <strong>15 minutes</strong>.</p>

        <p style="margin-top: 35px;">If you did not initiate this request, please contact us immediately at support@uncutdesign.com</p>

        <p style="margin-bottom:0px;">Thank you</p>
        <strong>Uncut Designs Team</strong>
        `,
      };
      const message = "Please check your email for the verification code to reset your password!";
      sendEmail(body, res, message);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// verifyPasswordResetCode - verify code for password reset
module.exports.verifyPasswordResetCode = async (req, res, next) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        status: "fail",
        error: "Email and verification code are required",
      });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({
        status: "fail",
        error: "User not found",
      });
    }

    if (!user.passwordResetVerificationCode) {
      return res.status(403).json({
        status: "fail",
        error: "No verification code found. Please request password reset again.",
      });
    }

    if (user.passwordResetVerificationCode !== code) {
      return res.status(403).json({
        status: "fail",
        error: "Invalid verification code",
      });
    }

    const expired = new Date() > new Date(user.passwordResetVerificationCodeExpires);

    if (expired) {
      return res.status(401).json({
        status: "fail",
        error: "Verification code expired. Please request a new one.",
      });
    }

    // Code is valid - return success (code will be cleared when password is reset)
    res.status(200).json({
      status: "success",
      message: "Verification code is valid. You can now reset your password.",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// confirm-forget-password - reset password with verification code
module.exports.confirmForgetPassword = async (req, res, next) => {
  try {
    const { email, code, password } = req.body;

    if (!email || !code || !password) {
      return res.status(400).json({
        status: "fail",
        error: "Email, verification code, and new password are required",
      });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({
        status: "fail",
        error: "User not found",
      });
    }

    if (!user.passwordResetVerificationCode) {
      return res.status(403).json({
        status: "fail",
        error: "No verification code found. Please request password reset again.",
      });
    }

    if (user.passwordResetVerificationCode !== code) {
      return res.status(403).json({
        status: "fail",
        error: "Invalid verification code",
      });
    }

    const expired = new Date() > new Date(user.passwordResetVerificationCodeExpires);

    if (expired) {
      return res.status(401).json({
        status: "fail",
        error: "Verification code expired. Please request a new one.",
      });
    }

    // Update password
    user.password = password;
    user.passwordResetVerificationCode = undefined;
    user.passwordResetVerificationCodeExpires = undefined;
    user.passwordChangedAt = new Date();

    await user.save();

    res.status(200).json({
      status: "success",
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// change password
module.exports.changePassword = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email: email });
    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Compare the current password with the one in the database
    const isMatch = bcrypt.compareSync(password, user.password);
    // If the current password is incorrect
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect current password" });
    }
    const hashedPassword = bcrypt.hashSync(req.body.newPassword);
    await User.updateOne({email:email},{password:hashedPassword})

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// update a profile
module.exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id
    const user = await User.findById(userId);
    if (user) {
      user.name = req.body.name;
      user.email = req.body.email;
      user.phone = req.body.phone;
      user.address = req.body.address;
      user.bio = req.body.bio; 
      const updatedUser = await user.save();
      const token = generateToken(updatedUser);
      res.status(200).json({
        status: "success",
        message: "Successfully updated profile",
        data: {
          user: updatedUser,
          token,
        },
      });
    }
  } catch (err) {
    console.log(err)
    res.status(404).send({
      message: 'Your email is not valid!',
    });
  }
};
