import mongoose from 'mongoose';
import { Resolver } from 'graphql-compose';
import { composeWithMongoose } from 'graphql-compose-mongoose';
import modelType from '../../model/type';
import { postTC } from './post';
import { userIdFilterArgs } from '../resolvers/userIdFilterArgs';
import { profileIdRecordArgs } from '../resolvers/profileIdRecordArgs';
import { get } from 'lodash';

const profileModel = mongoose.model(modelType.profileType);
const postModel = mongoose.model(modelType.postType);

export const profileTC = composeWithMongoose(profileModel);

profileTC.addFields({
  posts: new Resolver({
    name: 'PostRelative',
    type: [postTC],
    resolve: async ({ source, args, context }) => {
      const profileId = get(context, 'decoded.profileId', null);
      console.log(profileId, source._id);
      let filter = {
        profileId: source._id,
        pravicy: {
          $in: ['public'],
        },
      };
      if (profileId && source.friendIds.indexOf(profileId) > -1) {
        filter.pravicy.$in.push('friend');
      }
      if (profileId == source._id) {
        filter = {
          profileId: source._id,
        };
      }
      return await postModel
        .find(filter)
        .sort({ createdAt: 'desc' })
        .lean();
    },
  }),
});

profileTC.addResolver({
  name: 'sendFriendRequest',
  type: 'JSON',
  args: profileTC.getResolver('updateOne').args,
  resolve: async ({ args }) => {
    const { filter = {}, record = {} } = args;
    try {
      const reciever = await profileModel.findOneAndUpdate(
        filter,
        {
          $addToSet: {
            pendingFriendIds: record.profileId,
          },
        },
        { new: true, upsert: true },
      );
      return reciever;
    } catch (error) {
      throw new Error(error.message);
    }
  },
});

profileTC.addResolver({
  name: 'acceptFriendRequest',
  type: 'JSON',
  args: profileTC.getResolver('updateOne').args,
  resolve: async ({ args }) => {
    const { filter = {}, record = {} } = args;
    try {
      const reciever = await profileModel.findOneAndUpdate(
        filter,
        {
          $pull: {
            pendingFriendIds: record.userId,
          },
          $push: {
            friendIds: record.userId,
          },
        },
        { new: true, upsert: true },
      );
      await profileModel.findOneAndUpdate(
        { _id: record.userId },
        {
          $push: {
            friendIds: reciever._id,
          },
        },
        { new: true, upsert: true },
      );
      return {
        message: 'Success!',
      };
    } catch (error) {
      throw new Error(error.message);
    }
  },
});

profileTC.addResolver({
  name: 'decideFriendRequest',
  type: 'JSON',
  args: profileTC.getResolver('updateOne').args,
  resolve: async ({ args }) => {
    const { filter = {}, record = {} } = args;
    try {
      const reciever = await profileModel.findOneAndUpdate(
        filter,
        {
          $pull: {
            pendingFriendIds: record.profileId,
          },
        },
        { new: true, upsert: true },
      );
      return reciever;
    } catch (error) {
      throw new Error(error.message);
    }
  },
});

profileTC.setResolver('viewProfile', profileTC.getResolver('findOne').clone());

userIdFilterArgs(profileTC, ['findOne']);
userIdFilterArgs(profileTC, ['updateOne']);
userIdFilterArgs(profileTC, ['acceptFriendRequest']);
userIdFilterArgs(profileTC, ['decideFriendRequest']);
profileIdRecordArgs(profileTC, ['sendFriendRequest']);

export const resolver = {
  adminQuery: {
    profileFindOne: profileTC.getResolver('findOne'),
    profilePaginantion: profileTC.getResolver('pagination'),
  },
  userQuery: {
    profileFindOne: profileTC.getResolver('findOne'),
    profilePaginantion: profileTC.getResolver('pagination'),
  },
  adminMutation: {
    profileCreateOne: profileTC.getResolver('createOne'),
    profileUpdateOne: profileTC.getResolver('updateOne'),
    profileRemoveOne: profileTC.getResolver('removeOne'),
  },
  userMutaion: {
    profileUpdateOne: profileTC.getResolver('updateOne'),
    profileRemoveOne: profileTC.getResolver('removeOne'),
    sendFriendRequest: profileTC.getResolver('sendFriendRequest'),
    acceptFriendRequest: profileTC.getResolver('acceptFriendRequest'),
    decideFriendRequest: profileTC.getResolver('decideFriendRequest'),
  },
  guestQuery: {
    profileFindOne: profileTC.getResolver('findOne'),
    profilePaginantion: profileTC.getResolver('pagination'),
    viewProfile: profileTC.getResolver('viewProfile'),
  },
};
