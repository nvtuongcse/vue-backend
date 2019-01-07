import mongoose from 'mongoose';
import { composeWithMongoose } from 'graphql-compose-mongoose';
import modelType from '../../model/type';
import { postTC } from './post';
import { userIdFilterArgs } from '../resolvers/userIdFilterArgs';
import { userTC } from './user';
import { Resolver } from 'graphql-compose';

const profileModel = mongoose.model(modelType.profileType);
const postModel = mongoose.model(modelType.postType);

export const profileTC = composeWithMongoose(profileModel);

profileTC.addRelation('friends', {
  resolver: () => profileTC.getResolver('findByIds'),
  prepareArgs: {
    _ids: source => source.friendIds,
  },
  projection: {
    friendIds: 1,
  },
});

profileTC.addRelation('user', {
  resolver: () => userTC.getResolver('findById'),
  prepareArgs: {
    _id: source => source.userId,
  },
  projection: {
    userId: 1,
  },
});

profileTC.addFields({
  posts: new Resolver({
    name: 'PostRelative',
    type: [postTC],
    resolve: async ({ source }) => await postModel.find({ profileId: source._id }).lean(),
  }),
});

userIdFilterArgs(profileTC, ['findOne']);
userIdFilterArgs(profileTC, ['updateOne']);

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
  },
  guestQuery: {
    profileFindOne: profileTC.getResolver('findOne'),
    profilePaginantion: profileTC.getResolver('pagination'),
  },
};
