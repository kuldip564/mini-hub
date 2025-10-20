import User from "../model/user.model.js";
import ErrorHandler from "../untils/errorHendlar.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";
import sendEmail from "../untils/sendMail.js";
import crypto from "crypto";


const cookieOption = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  sameSite: "lax",
};


const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return next(new ErrorHandler("Please enter all required fields", 400));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorHandler("User already exists", 400));
    }

    const newUser = await User.create({
      name,
      email,
      password,
      avatar: {
        publicId: "default_avatar",
        secureUrl: email,
      },
    });

    try {
      if (req.file) {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "lms",
          width: 250,
          height: 250,
          gravity: "face",
          crop: "fill",
        });

        if (result) {
          newUser.avatar = {
            publicId: result.public_id,
            secureUrl: result.secure_url,
          };
          await newUser.save();
          await fs.rm(`temprare/${req.file.filename}`);
        }
      }
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      return next(new ErrorHandler("Image upload failed", 500));
    }

    const token = newUser.generateJWTToken();
    res.cookie("token", token, cookieOption);

    res.status(201).json({
      success: true,
      user: newUser
    });
  } catch (error) {
    return next(new ErrorHandler(error.message || "Internal Server Error", 500));
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Please enter both email and password", 400));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorHandler("User does not exist", 404));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new ErrorHandler("Incorrect password", 401));
    }

    const token = user.generateJWTToken();
    res.cookie("token", token, cookieOption);
    user.password = undefined;

    res.status(200).json({
      success: true,
      message: "Login successful",
      user
    });
  } catch (error) {
    return next(new ErrorHandler(error.message || "Internal Server Error", 500));
  }
};


const logout = (req, res, next) => {
  res.cookie("token", null, {
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

const me = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return next(new ErrorHandler("User not found", 403));
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        following: user.following,
        followers: user.followers,
        post: user.post
      },
    });
  } catch (error) {
    next(new ErrorHandler(error.message || "Internal Server Error", 500));
  }
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new ErrorHandler("Please provide an email address", 400));
  }
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const resetToken = await user.generatePasswordResetToken();
  await user.save();
  const forntUrl = `${req.protocol}://${req.get("host")}/reset-password/${resetToken}`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      message: `You requested a password reset. Click the link below to reset your password:\n\n${forntUrl}`,
    });
    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
      email: user.email,
    });
  }
  catch (error) {
    user.forgetPasswordToken = undefined;
    user.forgetPasswordDate = undefined;
    return next(new ErrorHandler(error.message || "Internal Server Error", 500));
  }
}

const resetpassword = async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!token || !password) {
    return next(new ErrorHandler("Please provide a valid token and new password", 400));
  }
  const forgotPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    forgetPasswordDate: forgotPasswordToken,
    forgetPasswordDate: { $gt: Date.now() }
  });
  if (!user) {
    return next(new ErrorHandler("Invalid or expired password reset token", 400));
  }

  user.password = password;
  user.forgetPasswordToken = undefined;
  user.forgetPasswordDate = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password has been reset successfully",
  });
};

const edit_profile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    if (req.file) {
      await cloudinary.v2.uploader.destroy(user.avatar.publicId);
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "lms",
        width: 250,
        height: 250,
        gravity: "face",
        crop: "fill",
      });

      if (result) {
        user.avatar = {
          publicId: result.public_id,
          secureUrl: result.secure_url,
        };
        await fs.rm(`temprare/${req.file.filename}`);
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });

  } catch (error) {
    return next(new ErrorHandler(error.message || "Internal Server Error", 500));
  }
};

const findall = async (req, res, next) => {
  try {
    const users = await User.find();
    if (!users || users.length === 0) {
      return next(new ErrorHandler("No users found", 404));
    }
    const userditel = users.map(user => ({
      _id: user._id,
      name: user.name,
      avatar: user.avatar.secureUrl,
      following: user.following,
      followers: user.followers,
      post: user.post
    }));
    res.status(200).json({
      success: true,
      userditel
    });
  } catch (error) {
    return next(new ErrorHandler(error.message || "Internal Server Error", 500));
  }
};

const SearchUser = async (req, res, next) => {
  try {
    const { search } = req.body;

    if (!search) {
      return next(new ErrorHandler("Please provide a search term", 400));
    }

    const users = await User.find({
      $or: [
        { name: { $regex: search, $options: "i" } }
      ]
    });

    if (users.length === 0) {
      return next(new ErrorHandler("No users found", 404));
    }

    const userditel = users.map(user => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar.secureUrl,
      following: user.following,

      followers: user.followers
    }));

    res.status(200).json({
      success: true,
      userditel
    });
  } catch (error) {
    return next(new ErrorHandler(error.message || "Internal Server Error", 500));
  }
};

const follow = async (req, res, next) => {
  const { coruntuserId, id } = req.body;
  if (!id) {
    return next(new ErrorHandler("Please provide a user ID to follow", 400));
  }
  if (coruntuserId === id) {
    return next(new ErrorHandler('you cant follow yur self', 404));
  }
  const user = await User.findById(id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  const loginUser = await User.findById(coruntuserId);
  if (!loginUser) {
    return next(new ErrorHandler("Current user not found", 404));
  }
  if (loginUser.following.includes(id)) {
    return next(new ErrorHandler("You are already following this user", 400));
  }
  loginUser.following.push(user);
  user.followers.push(loginUser);
  await loginUser.save();
  await user.save();
  res.json({
    success: true,
    message: "You are now following this user",

  });
}
const unFollow = async (req, res, next) => {
  const { coruntuserId, id } = req.body;
  if (!id) {
    return next(new ErrorHandler("Please provide a user ID to unfollow", 400));
  }
  const user = await User.findById(id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  const loginUser = await User.findById(coruntuserId);
  if (!loginUser) {
    return next(new ErrorHandler("Current user not found", 404));
  }
  if (!loginUser.following.includes(id)) {
    return next(new ErrorHandler("You are not following this user", 400));
  }

  loginUser.following = loginUser.following.filter(followingId => followingId.toString() !== id.toString());
  user.followers = user.followers.filter(followerId => followerId.toString() !== coruntuserId.toString());

  await loginUser.save();
  await user.save();

  res.json({
    success: true,
    message: "You have unfollowed this user",
  });
};

const addPost = async (req, res, next) => {
  const { title } = req.body;
  const userId = req.user.id;

  if (!title) {
    return next(new ErrorHandler("Enter title", 400));
  }

  const loginUser = await User.findById(userId);
  if (!loginUser) {
    return next(new ErrorHandler("User not found", 404));
  }

  try {
    let postObj = {
      title,
      Post: {
        publicId: '',
        secureUrl: ''
      }
    };
    console.log(req.file);

    if (req.file) {
      const result = await cloudinary.v2.uploader.upload(req.file.path);
      postObj.Post = {
        publicId: result.public_id,
        secureUrl: result.secure_url,
      };

      await fs.rm(`temprare/${req.file.filename}`);
    }

    // Push new post to user's posts array
    loginUser.post.push(postObj);
    await loginUser.save();

    res.json({
      success: true,
      message: "Post added successfully",
      posts: loginUser.post,
    });
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    return next(new ErrorHandler("Image upload failed", 500));
  }
};
const followingPost = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate("following");
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    const followedUsers = user.following;
    res.status(200).json({
      success: true,
      followedUsers
      // optional: flatten if posts are arrays
    });
  } catch (error) {
    return next(new ErrorHandler(error.message || "Internal Server Error", 500));
  }
};


const likePost = async (req, res, next) => {
  const { postId, postUserId } = req.body;
  const userId = req.user.id;

  if (!postId || !postUserId) {
    return next(new ErrorHandler("Post ID and Post User ID are required", 400));
  }

  try {
    const user = await User.findById(postUserId);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const post = user.post.id(postId);
    if (!post) {
      return next(new ErrorHandler("Post not found", 404));
    }

    // Ensure 'like' array exists
    if (!Array.isArray(post.like)) {
      post.like = [];
    }

    const alreadyLiked = post.like.some(id => id.toString() === userId.toString());

    if (alreadyLiked) {
      // Remove like
      post.like = post.like.filter(id => id.toString() !== userId.toString());
    } else {
      // Add like
      post.like.push(userId);
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: alreadyLiked ? "Post unliked successfully" : "Post liked successfully",
      post,
    });

  } catch (error) {
    return next(new ErrorHandler(error.message || "Internal Server Error", 500));
  }
};

const commentPost = async (req, res, next) => {
  const { postId,postUserId, comment } = req.body;
  const userId = req.user.id; 
  if (!postId || !comment) {
    return next(new ErrorHandler("Post ID and comment are required", 400));
  }
  try {
    const user = await User.findById(postUserId);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const post = user.post.id(postId);
    if (!post) {
      return next(new ErrorHandler("Post not found", 404));
    }

    // Ensure commentData exists
    if (!post.commentData) {
      post.commentData = [];
    }

    // Add new comment
    post.commentData.push({
      comment,
      user: userId,
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Comment added successfully",
      post,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message || "Internal Server Error", 500));
  }
};



export {
  register,
  login,
  logout,
  me,
  forgotPassword,
  resetpassword,
  edit_profile,
  findall,
  SearchUser,
  follow,
  unFollow,
  addPost,
  followingPost,
  likePost,
  commentPost
};
