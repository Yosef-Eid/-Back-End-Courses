// Import required modules and models
import User from '../models/users.js';
import { loginValidation, registerValidation } from '../validations/authValidation.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { uploadToCloudinary } from '../utils/uploadAvatar.js';
import Course from '../models/courses.js';
import {sendVerificationEmail} from '../utils/sendEmail.js';

// Get current user profile
export const getCurrentUser = async (req, res) => {
    try {
        // Find user by ID and exclude password
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all users - this currently just returns the logged-in user
export const getAllUsers = async (req, res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get user by specific ID
export const getUserById = async (req, res) => {
    try {
        const userId = await User.findById(req.params.id)
        if (!userId) return res.status(404).json({ success: false, message: 'User not found' })
        res.status(200).json(userId)
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const register = async (req, res) => {
    try {
        // Validate user input
        const { error } = registerValidation.validate(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        // Check if email is already used
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) return res.status(400).json({ success: false, message: 'Email already registered' });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);

        // Generate verification code (e.g., 6-digit number)
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationCodeExpires = Date.now() + 10 * 60 * 1000; // 10 minutes from now

        // Create new user with verification code
        const newUser = new User({
            ...req.body,
            verificationCode,
            verificationCodeExpires,
            isVerified: false // Ensure this field exists in your model
        });

        // Save user to DB
        const result = await newUser.save();

        // Send verification email
        await sendVerificationEmail(newUser.email, verificationCode);

        // Respond to client without JWT for now
        const { password, verificationCode: code, verificationCodeExpires: expires, ...other } = result._doc;
        res.status(201).json({
            success: true,
            message: 'User registered. Verification email sent.',
            // user: other
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

export const login = async (req, res) => {
    // Validate input
    const { error } = loginValidation.validate(req.body)
    if (error) return res.status(400).json({ success: false, message: error.details[0].message })
    try {
        // Find user by email
        const user = await User.findOne({ email: req.body.email })
        if (!user) return res.status(400).json({ message: 'error in email or password' })
            
        // Compare password
        const checkPassword = await bcrypt.compare(req.body.password, user.password)
        if (!checkPassword) return res.status(400).json({ message: 'error in email or password' })

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, name: user.name, admin: user.isAdmin },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '10d' }
        )

        const { password, ...other } = user._doc
        res.status(200).json({ ...other, token })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Update user profile
export const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        if (!user) return res.status(404).json({ message: 'User not found' })

        // Check if user uploaded a new avatar
        let avatarPath = req.files.avatar?.[0]?.path
        let avatarUrl = user.avatar
        if (avatarPath) avatarUrl = await uploadToCloudinary(avatarPath, 'upload');

        // Update user info
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { ...req.body, avatar: avatarUrl },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Profile updated successfully', updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// Delete user account
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Delete user courses
        await Course.deleteMany({ user: req.user.id });

        // Delete user channels
        await Channel.deleteMany({ user: req.user.id });

        // Delete user videos
        await Video.deleteMany({ user: req.user.id });

        // Delete user comments
        await Comment.deleteMany({ user: req.user.id });

        // Notify frontend via socket
        const io = req.app.get("io");
        io.emit("userDeleted", user);

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add or remove course from favorites
export const addCourseFavorite = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('favorite')
        const courseId = req.params.courseId

        // Toggle favorite status
        if (user.favorite.includes(courseId)) user.favorite.pull(courseId)
        else user.favorite.push(courseId)

        await user.save()

        // Notify frontend via socket
        const io = req.app.get("io");
        io.emit("userUpdated", user);

        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get all favorite courses
export const getFavoriteCourses = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('favorite')
        const courses = await Course.find({ _id: { $in: user.favorite } }).select('-videos')
        res.status(200).json(courses)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Add or remove course from shopping cart
export const addCourseToCart = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('cart')
        const courseId = req.params.courseId

        if (!user) return res.status(404).json({ message: 'User not found' })

        // Toggle course in cart
        if (user.cart.includes(courseId)) user.cart.pull(courseId)
        else user.cart.push(courseId)

        await user.save()

        // Notify frontend via socket
        const io = req.app.get("io");
        io.emit("userUpdated", user);

        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get all courses in the cart
export const getCartCourses = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('cart')
        const courses = await Course.find({ _id: { $in: user.cart } }).select('-videos')
        res.status(200).json(courses)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


// controllers/authController.js

export const verifyEmailCode = async (req, res) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({ success: false, message: 'Email and code are required' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ success: false, message: 'Email already verified' });
        }

        if (user.verificationCode !== code) {
            return res.status(400).json({ success: false, message: 'Invalid verification code' });
        }

        if (user.verificationCodeExpires < Date.now()) {
            return res.status(400).json({ success: false, message: 'Verification code expired' });
        }

        // Mark email as verified
        user.isVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;
        await user.save();

        // Create JWT token
        const token = jwt.sign(
            { id: user._id, name: user.name, admin: user.isAdmin },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '10d' }
        );

        const { password, ...other } = user._doc;

        res.status(200).json({
            success: true,
            message: 'Email verified successfully',
            user: other,
            token
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};


export const resendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ success: false, message: 'Email already verified' });
        }

        // Generate new code and expiry
        const newCode = Math.floor(100000 + Math.random() * 900000).toString();
        const newExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

        user.verificationCode = newCode;
        user.verificationCodeExpires = newExpiry;
        await user.save();

        await sendVerificationEmail(user.email, newCode);

        res.status(200).json({
            success: true,
            message: 'Verification code resent to email'
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

