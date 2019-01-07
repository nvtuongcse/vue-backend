'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolver = exports.userTC = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _graphqlComposeMongoose = require('graphql-compose-mongoose');

var _type = require('../../model/type');

var _type2 = _interopRequireDefault(_type);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const userModel = _mongoose2.default.model(_type2.default.userType);
const userTC = exports.userTC = (0, _graphqlComposeMongoose.composeWithMongoose)(userModel);

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
  }
};