import Joi from "joi";

export const videoValidation = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(3).max(100).required(),
    video: Joi.string().required(),
    thumbnail: Joi.string().optional()
});