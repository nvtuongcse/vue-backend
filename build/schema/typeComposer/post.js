'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolver = exports.postTC = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _graphqlComposeMongoose = require('graphql-compose-mongoose');

var _type = require('../../model/type');

var _type2 = _interopRequireDefault(_type);

var _profileIdRecordArgs = require('../resolvers/profileIdRecordArgs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const postModel = _mongoose2.default.model(_type2.default.postType);

const postTC = exports.postTC = (0, _graphqlComposeMongoose.composeWithMongoose)(postModel);

(0, _profileIdRecordArgs.profileIdRecordArgs)(postTC, ['createOne']);

const resolver = exports.resolver = {
  adminQuery: {
    postFindOne: postTC.getResolver('findOne'),
    postPaginantion: postTC.getResolver('pagination')
  },
  userQuery: {
    postFindOne: postTC.getResolver('findOne'),
    postPaginantion: postTC.getResolver('pagination')
  },
  adminMutation: {
    postRemoveOne: postTC.getResolver('removeOne')
  },
  userMutaion: {
    postCreateOne: postTC.getResolver('createOne'),
    postRemoveOne: postTC.getResolver('removeOne')
  }
};