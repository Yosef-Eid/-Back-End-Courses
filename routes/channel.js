import express from 'express';
import { createChannel, deleteChannel, getAllChannels, getChannel, updateChannel } from '../controls/controlChannel.js';
import { verifyToken, verifyTokenIsAdmin } from '../middlewares/verify.js';
import { checkChannelOwnership } from '../middlewares/channelMiddleware.js';
import { upload, } from '../utils/uploadAvatar.js';

const router = express.Router();

router.get('/getAllChannels', verifyTokenIsAdmin, getAllChannels)
router.get('/getChannel', verifyToken, getChannel)
router.post('/createCannel', verifyToken, upload, createChannel)
router.put('/updateChannel/:channelId', verifyToken, checkChannelOwnership, upload, updateChannel)
router.delete('/deleteChannel/:channelId', verifyToken, checkChannelOwnership, deleteChannel)

export default router