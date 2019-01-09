import mongoose, { Schema, SchemaTypes } from 'mongoose';
import modelType from './type';

const { String, ObjectId } = SchemaTypes;

const commentSchema = Schema({
  profileId: {
    type: ObjectId,
    ref: modelType.profileType,
  },
  content: String,
});

const postSchema = Schema(
  {
    title: String,
    imgUrl: {
      type: String,
    },
    decription: {
      type: String,
    },
    profileId: {
      type: ObjectId,
      ref: modelType.profileType,
    },
    content: {
      type: String,
    },
    pravicy: {
      type: String,
      enum: ['private', 'public', 'friend'],
    },
    comments: [commentSchema],
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
    collection: modelType.postIndex,
  },
);

module.exports = mongoose.model(modelType.postType, postSchema);
