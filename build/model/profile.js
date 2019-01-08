'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.profileModel = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _type = require('./type');

var _type2 = _interopRequireDefault(_type);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { String, ObjectId } = _mongoose.SchemaTypes;

const profileSchema = (0, _mongoose.Schema)({
  name: String,
  decription: {
    type: String
  },
  fullName: String,
  userId: {
    type: ObjectId,
    ref: _type2.default.userType
  },
  postIds: {
    type: [ObjectId],
    ref: _type2.default.postType
  },
  pendingFriends: {
    type: [ObjectId],
    ref: _type2.default.profileType
  },
  friendIds: {
    type: [ObjectId],
    ref: _type2.default.profileType
  },
  updatedAt: {
    type: Date,
    index: true
  },
  createdAt: {
    type: Date,
    index: true
  }
}, {
  timestamps: true,
  collection: _type2.default.profileIndex
});

const profileModel = exports.profileModel = _mongoose2.default.model(_type2.default.profileType, profileSchema);