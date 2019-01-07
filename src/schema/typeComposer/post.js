import mongoose from 'mongoose';
import { composeWithMongoose } from 'graphql-compose-mongoose';
import modelType from '../../model/type';
import { profileIdRecordArgs } from '../resolvers/profileIdRecordArgs';

const postModel = mongoose.model(modelType.postType);

export const postTC = composeWithMongoose(postModel);

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
  },
};
