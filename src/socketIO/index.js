import SocketIO from 'socket.io';
import server from '../index';
import mongoose from 'mongoose';
import modelType from '../model/type';
import { verifyToken, JWTSECRETKEY } from '../schema/resolvers/authenResolver';

const postModel = mongoose.model(modelType.postType);

export const io = SocketIO(server);

export const postIO = io.of('/post').on('connection', (socket) => {
  socket.on('join-room', (channel) => {
    console.log('On Join room');
    socket.join(channel);
  });
  socket.on('addComment', async ({ content, token, _id }) => {
    console.log('On add Comment');
    try {
      const decoded = await verifyToken(JWTSECRETKEY, token);
      const postOne = await postModel.findOneAndUpdate({ _id }, {
        $push: {
          comments: { content, profileId: decoded.profileId },
        },
      }, { new: true, upsert: true });
      postIO.to(`${_id}`).emit('addedComment', postOne);
      console.log('On added Comment');
    } catch (error) {
      throw new Error(error.message);
    }
  });
});
