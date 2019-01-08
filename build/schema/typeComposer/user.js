'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolver = exports.userTC = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _graphqlComposeMongoose = require('graphql-compose-mongoose');

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _type = require('../../model/type');

var _type2 = _interopRequireDefault(_type);

var _authenResolver = require('../resolvers/authenResolver');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const userModel = _mongoose2.default.model(_type2.default.userType);
const userTC = exports.userTC = (0, _graphqlComposeMongoose.composeWithMongoose)(userModel);

userTC.addResolver({
  name: 'signUp',
  args: userTC.getResolver('createOne').args,
  type: 'JSON',
  resolve: async resoverParams => {
    try {
      const res = await userTC.getResolver('createOne').resolve(resoverParams);
      const {
        record: { _id, email, profileId }
      } = res;
      return {
        token: (0, _authenResolver.generateToken)(_authenResolver.JWTSECRETKEY, {
          _id,
          email,
          profileId
        }, 60 * 60)
      };
    } catch (error) {
      if (error.code === 11000) throw new Error('This email is in use!');
    }
  }
});
userTC.addResolver({
  name: 'signIn',
  args: {
    email: 'String',
    password: 'String'
  },
  type: 'JSON',
  resolve: async ({ args: { email, password } }) => {
    try {
      const user = await userModel.findOne({ email }).lean();
      if (!user) throw new Error('User not found!');
      const res = await _bcryptjs2.default.compare(password, user.password);
      if (!res) return new Error('Wrong password!');
      return {
        token: (0, _authenResolver.generateToken)(_authenResolver.JWTSECRETKEY, {
          _id: user._id,
          email: user.email,
          profileId: user.profileId
        }, 60 * 60)
      };
    } catch (error) {
      throw error;
    }
  }
});

const resolver = exports.resolver = {
  adminQuery: {
    userFindOne: userTC.getResolver('findOne'),
    userPaginantion: userTC.getResolver('pagination')
  },
  userQuery: {
    userFindOne: userTC.getResolver('findOne'),
    userPaginantion: userTC.getResolver('pagination')
  },
  adminMutation: {
    userCreateOne: userTC.getResolver('createOne'),
    userUpdateOne: userTC.getResolver('updateOne'),
    userRemoveOne: userTC.getResolver('removeOne')
  },
  userMutaion: {
    userRemoveOne: userTC.getResolver('removeOne')
  },
  guestMutation: {
    signIn: userTC.getResolver('signIn'),
    signUp: userTC.getResolver('signUp')
  }
};