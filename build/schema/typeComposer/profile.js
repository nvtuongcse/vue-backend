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

var _userIdFilterArgs = require('../resolvers/userIdFilterArgs');

var _user = require('./user');

var _graphqlCompose = require('graphql-compose');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const profileModel = _mongoose2.default.model(_type2.default.profileType);
const postModel = _mongoose2.default.model(_type2.default.postType);

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

profileTC.addRelation('user', {
  resolver: () => _user.userTC.getResolver('findById'),
  prepareArgs: {
    _id: source => source.userId
  },
  projection: {
    userId: 1
  }
});

profileTC.addFields({
  posts: new _graphqlCompose.Resolver({
    name: 'PostRelative',
    type: [_post.postTC],
    resolve: async ({ source }) => await postModel.find({ profileId: source._id }).lean()
  })
});

(0, _userIdFilterArgs.userIdFilterArgs)(profileTC, ['findOne']);
(0, _userIdFilterArgs.userIdFilterArgs)(profileTC, ['updateOne']);

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
    profileUpdateOne: profileTC.getResolver('updateOne'),
    profileRemoveOne: profileTC.getResolver('removeOne')
  },
  guestQuery: {
    profileFindOne: profileTC.getResolver('findOne'),
    profilePaginantion: profileTC.getResolver('pagination')
  }
};