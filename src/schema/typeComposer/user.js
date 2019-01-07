import mongoose from 'mongoose';
import { composeWithMongoose } from 'graphql-compose-mongoose';
import bcryptjs from 'bcryptjs';
import modelType from '../../model/type';

import {
  generateToken,
  JWTSECRETKEY,
} from '../resolvers/authenResolver';

const userModel = mongoose.model(modelType.userType);
export const userTC = composeWithMongoose(userModel);

userTC.addResolver({
  name: 'signUp',
  args: userTC.getResolver('createOne').args,
  type: 'JSON',
  resolve: async (resoverParams) => {
    try {
      const res = await userTC.getResolver('createOne').resolve(resoverParams);
      const {
        record: { _id, email, profileId },
      } = res;
      return {
        token: generateToken(
          JWTSECRETKEY,
          {
            _id,
            email,
            profileId,
          },
          60 * 60,
        ),
      };
    } catch (error) {
      if (error.code === 11000) throw new Error('This email is in use!');
    }
  },
});
userTC.addResolver({
  name: 'signIn',
  args: {
    email: 'String',
    password: 'String',
  },
  type: 'JSON',
  resolve: async ({ args: { email, password } }) => {
    try {
      const user = await userModel.findOne({ email }).lean();
      if (!user) throw new Error('User not found!');
      const res = await bcryptjs.compare(password, user.password);
      if (!res) return new Error('Wrong password!');
      return {
        token: generateToken(
          JWTSECRETKEY,
          {
            _id: user._id,
            email: user.email,
            profileId: user.profileId,
          },
          60 * 60,
        ),
      };
    } catch (error) {
      throw error;
    }
  },
});

export const resolver = {
  adminQuery: {
    userFindOne: userTC.getResolver('findOne'),
    userPaginantion: userTC.getResolver('pagination'),
  },
  userQuery: {
    userFindOne: userTC.getResolver('findOne'),
    userPaginantion: userTC.getResolver('pagination'),
  },
  adminMutation: {
    userCreateOne: userTC.getResolver('createOne'),
    userUpdateOne: userTC.getResolver('updateOne'),
    userRemoveOne: userTC.getResolver('removeOne'),
  },
  userMutaion: {
    userRemoveOne: userTC.getResolver('removeOne'),
  },
  guestMutation: {
    signIn: userTC.getResolver('signIn'),
    signUp: userTC.getResolver('signUp'),
  },
};
