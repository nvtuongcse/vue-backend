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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const postModel = _mongoose2.default.model(_type2.default.postType);

const postTC = exports.postTC = (0, _graphqlComposeMongoose.composeWithMongoose)(postModel);

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
    postCreateOne: postTC.getResolver('createOne'),
    postUpdateOne: postTC.getResolver('updateOne'),
    postRemoveOne: postTC.getResolver('removeOne')
  },
  userMutaion: {
    postRemoveOne: postTC.getResolver('removeOne')
  }
};