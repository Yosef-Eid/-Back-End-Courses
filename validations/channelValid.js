import Joi from "joi";

export const channelValidation = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(3).max(100).required(),
});

export const updateChannelValidation = Joi.object({
    name: Joi.string().min(3).max(100).optional(),
    description: Joi.string().min(3).max(100).optional(),
    avatar: Joi.string().uri().optional(),
    background: Joi.string().uri().optional(),
});