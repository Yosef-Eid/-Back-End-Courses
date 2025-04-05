import Joi from 'joi';
import passwordComplexity from "joi-password-complexity";

// register
export const registerValidation = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: passwordComplexity().required(),
    profileImage: Joi.string().uri().optional(),
});

// login
export const loginValidation = Joi.object({
    email: Joi.string().email().required(),
    password: passwordComplexity().required(),
})

// update
export const updateUserValidation = Joi.object({
    name: Joi.string().min(3).max(50),
    email: Joi.string().email(),
    password: passwordComplexity()
})

