'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.graphqlSchema = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _graphqlCompose = require('graphql-compose');

var _typeComposer = require('./typeComposer');

var _typeComposer2 = _interopRequireDefault(_typeComposer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const AdminQueryTC = _graphqlCompose.GQC.getOrCreateTC('AdminQuery');
const UserQueryTC = _graphqlCompose.GQC.getOrCreateTC('UserQuery');

const AdminMutationTC = _graphqlCompose.GQC.getOrCreateTC('AdminMutation');
const UserMutationTC = _graphqlCompose.GQC.getOrCreateTC('UserMutation');

_graphqlCompose.GQC.rootMutation().addFields({
  userMutation: {
    type: UserMutationTC,
    resolve: (parentValues, args, context) => ''
  },
  adminMutation: {
    type: AdminMutationTC,
    resolve: (parentValues, args, context) => ''
  }
});
_graphqlCompose.GQC.rootQuery().addFields({
  userQuery: {
    type: UserQueryTC,
    resolve: (parentValues, args, context) => ''
  },
  adminQuery: {
    type: AdminQueryTC,
    resolve: (parentValues, args, context) => ''
  }
});

AdminMutationTC.addFields((0, _extends3.default)({}, _typeComposer2.default.adminMutation));
UserMutationTC.addFields((0, _extends3.default)({}, _typeComposer2.default.userMutaion));
AdminQueryTC.addFields((0, _extends3.default)({}, _typeComposer2.default.adminQuery));
UserQueryTC.addFields((0, _extends3.default)({}, _typeComposer2.default.userQuery));

const graphqlSchema = exports.graphqlSchema = _graphqlCompose.GQC.buildSchema();