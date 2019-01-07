'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolver = exports.profileTC = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _graphqlComposeMongoose = require('graphql-compose-mongoose');

var _type = require('../../model/type');

var _type2 = _interopRequireDefault(_type);

var _post = require('./post');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const profileModel = _mongoose2.default.model(_type2.default.profileType);

const profileTC = exports.profileTC = (0, _graphqlComposeMongoose.composeWithMongoose)(profileModel);

profileTC.addRelation('friends', {
  resolver: () => profileTC.getResolver('findByIds'),
  prepareArgs: {
    _ids: source => source.friendIds
  },
  projection: {
    friendIds: 1
  }
});

profileTC.addRelation('posts', {
  resolver: () => _post.postTC.getResolver('findByIds'),
  prepareArgs: {
    _ids: source => source.postIds
  },
  projection: {
    postIds: 1
  }
});

const resolver = exports.resolver = {
  adminQuery: {
    profileFindOne: profileTC.getResolver('findOne'),
    profilePaginantion: profileTC.getResolver('pagination')
  },
  userQuery: {
    profileFindOne: profileTC.getResolver('findOne'),
    profilePaginantion: profileTC.getResolver('pagination')
  },
  adminMutation: {
    profileCreateOne: profileTC.getResolver('createOne'),
    profileUpdateOne: profileTC.getResolver('updateOne'),
    profileRemoveOne: profileTC.getResolver('removeOne')
  },
  userMutaion: {
    profileRemoveOne: profileTC.getResolver('removeOne')
  }
};