import mongoose, { Schema, SchemaTypes } from 'mongoose';
import modelType from './type';

const { String, ObjectId } = SchemaTypes;

const profileSchema = Schema(
  {
    name: String,
    decription: {
      type: String,
    },
    fullName: String,
    userId: {
      type: ObjectId,
      ref: modelType.userType,
    },
    postIds: {
      type: [ObjectId],
      ref: modelType.postType,
    },
    pendingFriendIds: {
      type: [ObjectId],
      ref: modelType.profileType,
    },
    friendIds: {
      type: [ObjectId],
      ref: modelType.profileType,
    },
    updatedAt: {
      type: Date,
      index: true,
    },
    createdAt: {
      type: Date,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: modelType.profileIndex,
  }
);

export const profileModel = mongoose.model(
  modelType.profileType,
  profileSchema
);
