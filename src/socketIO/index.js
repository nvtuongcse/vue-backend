import SocketIO from 'socket.io';
import server from '../index';
import mongoose from 'mongoose';
import modelType from '../model/type';
import { verifyToken, JWTSECRETKEY } from '../schema/resolvers/authenResolver';

const postModel = mongoose.model(modelType.postType);

export const io = SocketIO(server);

export const postIO = io.of('/post').on('connection', (socket) => {
  socket.on('join-room', (channel) => {
    socket.join(channel);
  });
  socket.on('leave-room', (channel) => {
    socket.leave(channel);
  });
  socket.on('disconnect', () => {
    socket.disconnect(true);
    (socket);
  });
  socket.on('add-comment', async ({ content, token, _id }) => {
    try {
      const decoded = await verifyToken(JWTSECRETKEY, token);
      const postOne = await postModel
        .findOneAndUpdate(
          { _id },
          {
            $push: {
              comments: { content, profileId: decoded.profileId },
            },
          },
          { new: true, upsert: true },
        )
        .lean();
      postIO.to(`${postOne._id}`).emit('comment-added', postOne);
    } catch (error) {
      throw new Error(error.message);
    }
  });
});
