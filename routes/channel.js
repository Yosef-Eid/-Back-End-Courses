import express from 'express';
import { createChannel, deleteChannel, getAllChannels, getChannel, updateChannel } from '../controls/controlChannel.js';
import { verifyToken, verifyTokenIsAdmin } from '../middlewares/verify.js';
import { checkChannelOwnership } from '../middlewares/channelMiddleware.js';
import { upload, } from '../utils/uploadAvatar.js';

const router = express.Router();

/**
 * @swagger
 * /api/channel/getAllChannels:
 *   get:
 *     summary: Get all channels (Admin only)
 *     tags: [Channels]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all channels
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Not an admin
 */
router.get('/getAllChannels', verifyTokenIsAdmin, getAllChannels)

/**
 * @swagger
 * /api/channel/getChannel:
 *   get:
 *     summary: Get a specific channel
 *     tags: [Channels]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Channel details retrieved successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Channel not found
 */
router.get('/getChannel', verifyToken, getChannel)

/**
 * @swagger
 * /api/channel/createCannel:
 *   post:
 *     summary: Create a new channel
 *     tags: [Channels]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Channel created successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       400:
 *         description: Invalid input data
 */
router.post('/createCannel', verifyToken, upload, createChannel)

/**
 * @swagger
 * /api/channel/updateChannel/{channelId}:
 *   put:
 *     summary: Update a channel
 *     tags: [Channels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: channelId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Channel updated successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Not channel owner
 *       404:
 *         description: Channel not found
 */
router.put('/updateChannel/:channelId', verifyToken, checkChannelOwnership, upload, updateChannel)

/**
 * @swagger
 * /api/channel/deleteChannel/{channelId}:
 *   delete:
 *     summary: Delete a channel
 *     tags: [Channels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: channelId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Channel deleted successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Not channel owner
 *       404:
 *         description: Channel not found
 */
router.delete('/deleteChannel/:channelId', verifyToken, checkChannelOwnership, deleteChannel)

export default router