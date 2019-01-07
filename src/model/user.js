import mongoose, { Schema, SchemaTypes } from 'mongoose';
import modelType from './type';
import bcryptjs from 'bcryptjs';

const { String, ObjectId } = SchemaTypes;

const userSchema = Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    password: String,
    updatedAt: {
      type: Date,
      index: true,
    },
    profileId: {
      type: ObjectId,
      ref: modelType.profileType,
    },
    createdAt: {
      type: Date,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: modelType.userIndex,
  },
);
userSchema.pre('save', async function (next) {
  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    const profileModel = mongoose.model(modelType.profileType);
    const profileOne = await profileModel.create({ userId: this._id });
    this.profileId = profileOne._id;
    next();
  } catch (error) {
    throw error;
  }
});

export const userModel = mongoose.model(modelType.userType, userSchema);
