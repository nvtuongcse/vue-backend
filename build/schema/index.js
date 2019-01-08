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

var _authenResolver = require('./resolvers/authenResolver');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const AdminQueryTC = _graphqlCompose.GQC.getOrCreateTC('AdminQuery');
const UserQueryTC = _graphqlCompose.GQC.getOrCreateTC('UserQuery');

const AdminMutationTC = _graphqlCompose.GQC.getOrCreateTC('AdminMutation');
const UserMutationTC = _graphqlCompose.GQC.getOrCreateTC('UserMutation');
const GuestMutationTC = _graphqlCompose.GQC.getOrCreateTC('GuestMutation');
const GuestQueryTC = _graphqlCompose.GQC.getOrCreateTC('GuestQuery');

async function authentication(context) {
  if ((context.request.method === 'GET' || context.request.method === 'POST') && context.request.headers && context.request.headers.authorization) {
    try {
      const token = context.request.headers.authorization;
      const decoded = await (0, _authenResolver.verifyToken)(_authenResolver.JWTSECRETKEY, token);
      context.decoded = decoded;
      return '';
    } catch (e) {
      throw new Error((0, _extends3.default)({
        code: 401
      }, e));
    }
  }
  throw new Error({
    code: 401,
    message: 'Unauthorization'
  });
}

_graphqlCompose.GQC.rootMutation().addFields({
  userMutation: {
    type: UserMutationTC,
    resolve: async (parentValues, args, context) => {
      try {
        return await authentication(context);
      } catch (error) {
        throw new Error('Unauthorization');
      }
    }
  },
  adminMutation: {
    type: AdminMutationTC,
    resolve: async (parentValues, args, context) => {
      try {
        return await authentication(context);
      } catch (error) {
        throw new Error('Unauthorization');
      }
    }
  },
  guestMutation: {
    type: GuestMutationTC,
    resolve: async (parentValues, args, context) => ''
  }
});
_graphqlCompose.GQC.rootQuery().addFields({
  userQuery: {
    type: UserQueryTC,
    resolve: async (parentValues, args, context) => {
      try {
        return await authentication(context);
      } catch (error) {
        throw new Error('Unauthorization');
      }
    }
  },
  adminQuery: {
    type: AdminQueryTC,
    resolve: async (parentValues, args, context) => {
      try {
        return await authentication(context);
      } catch (error) {
        throw new Error('Unauthorization');
      }
    }
  },
  guestQuery: {
    type: GuestQueryTC,
    resolve: async (parentValues, args, context) => ''
  }
});

AdminMutationTC.addFields((0, _extends3.default)({}, _typeComposer2.default.adminMutation));
UserMutationTC.addFields((0, _extends3.default)({}, _typeComposer2.default.userMutaion));
AdminQueryTC.addFields((0, _extends3.default)({}, _typeComposer2.default.adminQuery));
UserQueryTC.addFields((0, _extends3.default)({}, _typeComposer2.default.userQuery));
GuestMutationTC.addFields((0, _extends3.default)({}, _typeComposer2.default.guestMutation));
GuestQueryTC.addFields((0, _extends3.default)({}, _typeComposer2.default.guestQuery));

const graphqlSchema = exports.graphqlSchema = _graphqlCompose.GQC.buildSchema();