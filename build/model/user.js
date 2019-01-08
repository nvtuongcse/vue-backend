'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userModel = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _type = require('./type');

var _type2 = _interopRequireDefault(_type);

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { String, ObjectId } = _mongoose.SchemaTypes;

const userSchema = (0, _mongoose.Schema)({
  email: {
    type: String,
    unique: true
  },
  password: String,
  updatedAt: {
    type: Date,
    index: true
  },
  profileId: {
    type: ObjectId,
    ref: _type2.default.profileType
  },
  createdAt: {
    type: Date,
    index: true
  }
}, {
  timestamps: true,
  collection: _type2.default.userIndex
});
userSchema.pre('save', async function (next) {
  try {
    const salt = await _bcryptjs2.default.genSalt(10);
    this.password = await _bcryptjs2.default.hash(this.password, salt);
    const profileModel = _mongoose2.default.model(_type2.default.profileType);
    const profileOne = await profileModel.create({ userId: this._id });
    this.profileId = profileOne._id;
    next();
  } catch (error) {
    throw error;
  }
});

const userModel = exports.userModel = _mongoose2.default.model(_type2.default.userType, userSchema);