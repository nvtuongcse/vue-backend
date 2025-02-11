import mongoose from 'mongoose';
import { composeWithMongoose } from 'graphql-compose-mongoose';
import modelType from '../../model/type';
import { profileIdRecordArgs } from '../resolvers/profileIdRecordArgs';
import { profileTC } from './profile';

const postModel = mongoose.model(modelType.postType);

export const postTC = composeWithMongoose(postModel);


postTC.addRelation('author', {
  resolver: () => profileTC.getResolver('findById'),
  prepareArgs: {
    _id: source => source.profileId,
  },
  projection: { profileId: true },
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
  },
};
