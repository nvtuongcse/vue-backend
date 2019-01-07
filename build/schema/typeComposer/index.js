'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _post = require('./post');

var _user = require('./user');

var _profile = require('./profile');

exports.default = (0, _lodash.merge)({}, _post.resolver, _user.resolver, _profile.resolver);