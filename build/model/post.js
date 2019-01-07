'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _type = require('./type');

var _type2 = _interopRequireDefault(_type);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { String } = _mongoose.SchemaTypes;

const postSchema = (0, _mongoose.Schema)({
  title: String,
  imageUrl: {
    type: String
  },
  decription: {
    type: String
  },
  content: {
    type: String
  },
  pravicy: {
    type: String,
    enum: ['private', 'public', 'friend']
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
  collection: _type2.default.postIndex
});

module.exports = _mongoose2.default.model(_type2.default.postType, postSchema);