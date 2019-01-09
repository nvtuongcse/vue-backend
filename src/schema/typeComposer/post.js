import mongoose, { disconnect } from 'mongoose';
import { composeWithMongoose } from 'graphql-compose-mongoose';
import modelType from '../../model/type';
import { profileIdRecordArgs } from '../resolvers/profileIdRecordArgs';
import { postIO } from '../../socketIO';

const postModel = mongoose.model(modelType.postType);

export const postTC = composeWithMongoose(postModel);

postTC.addResolver({
  name: 'subPost',
  type: 'JSON',
  args: postTC.getResolver('findOne').args,
  resolve: async ({ args }) => {
    const {
      filter: { _id },
    } = args;
    postIO.on('connection', (socket) => {
      socket.join(`${_id}`);
      socket.on('addComment', async ({ profileId, content }) => {
        try {
          const postOne = await postModel.findOneAndUpdate({ _id }, {
            $push: {
              comments: { content, profileId },
            },
          }, { new: true, upsert: true });
          postIO.to(`${postOne._id}`).emit('addedComment', postOne);
        } catch (error) {
          throw new Error(error.message);
        }
      });
    });
    postIO.on('disconnect', (socket) => {
      socket.leave(`${_id}`);
    });
  },
});

profileIdRecordArgs(postTC, ['createOne']);

export const resolver = {
  adminQuery: {
    postFindOne: postTC.getResolver('findOne'),
    postPaginantion: postTC.getResolver('pagination'),
  },
  userQuery: {
    postFindOne: postTC.getResolver('findOne'),
    postPaginantion: postTC.getResolver('pagination'),
  },
  adminMutation: {
    postRemoveOne: postTC.getResolver('removeOne'),
  },
  userMutaion: {
    postCreateOne: postTC.getResolver('createOne'),
    postRemoveOne: postTC.getResolver('removeOne'),
    postUpdateOne: postTC.getResolver('updateOne'),
    subPost: postTC.getResolver('subPost'),
  },
  guestMutation: {
    subPost: postTC.getResolver('subPost'),
  },
};
