// Import required modules and models
import User from '../models/users.js';
import { loginValidation, registerValidation } from '../validations/authValidation.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { uploadToCloudinary } from '../utils/uploadAvatar.js';
import Course from '../models/courses.js';

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

// Register new user
export const register = async (req, res) => {
    try {
        // Validate user input using Joi
        const { error } = registerValidation.validate(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message })

        // Check if email is already used
        const user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).json({ success: false, message: 'Email already registered' });

        // Hash password using bcrypt
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);

        // Create new user object
        const newUser = new User(req.body);

        // Generate JWT token
        const token = jwt.sign(
            { id: newUser._id, name: newUser.name, admin: newUser.isAdmin },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '10d' }
        );

        // Save user to database
        const result = await newUser.save();
        const { password, ...other } = result._doc;

        // Return user data and token
        res.status(201).json({ ...other, token });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

// Login user
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
