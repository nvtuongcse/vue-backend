'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userModel = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _type = require('./type');

var _type2 = _interopRequireDefault(_type);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { String } = _mongoose.SchemaTypes;

const userSchema = (0, _mongoose.Schema)({
  email: String,
  password: String,
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
  collection: _type2.default.userIndex
});

const userModel = exports.userModel = _mongoose2.default.model(_type2.default.userType, userSchema);