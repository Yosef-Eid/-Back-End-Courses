import Joi from "joi";

export const courseValidation = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(3).max(5000).required(),
    price: Joi.number().required(),
    thumbnail: Joi.string().uri().optional(),
});

export const updateCourseValidation = Joi.object({
    title: Joi.string().min(3).max(100).optional(),
    description: Joi.string().min(3).max(100).optional(),
    price: Joi.number().optional(),
    thumbnail: Joi.string().uri().optional(),
});
