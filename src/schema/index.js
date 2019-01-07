import { GQC } from 'graphql-compose';
import typeComposer from './typeComposer';
import { JWTSECRETKEY, verifyToken } from './resolvers/authenResolver';

const AdminQueryTC = GQC.getOrCreateTC('AdminQuery');
const UserQueryTC = GQC.getOrCreateTC('UserQuery');

const AdminMutationTC = GQC.getOrCreateTC('AdminMutation');
const UserMutationTC = GQC.getOrCreateTC('UserMutation');
const GuestMutationTC = GQC.getOrCreateTC('GuestMutation');
const GuestQueryTC = GQC.getOrCreateTC('GuestQuery');

async function authentication(context) {
  if (
    (context.request.method === 'GET' || context.request.method === 'POST') &&
    context.request.headers &&
    context.request.headers.authorization
  ) {
    try {
      const token = context.request.headers.authorization;
      const decoded = await verifyToken(JWTSECRETKEY, token);
      context.decoded = decoded;
      return '';
    } catch (e) {
      throw new Error({
        code: 401,
        ...e,
      });
    }
  }
  throw new Error({
    code: 401,
    message: 'Unauthorization',
  });
}

GQC.rootMutation().addFields({
  userMutation: {
    type: UserMutationTC,
    resolve: async (parentValues, args, context) => {
      try {
        return await authentication(context);
      } catch (error) {
        throw new Error('Unauthorization');
      }
    },
  },
  adminMutation: {
    type: AdminMutationTC,
    resolve: async (parentValues, args, context) => {
      try {
        return await authentication(context);
      } catch (error) {
        throw new Error('Unauthorization');
      }
    },
  },
  guestMutation: {
    type: GuestMutationTC,
    resolve: async (parentValues, args, context) => '',
  },
});
GQC.rootQuery().addFields({
  userQuery: {
    type: UserQueryTC,
    resolve: async (parentValues, args, context) => {
      try {
        return await authentication(context);
      } catch (error) {
        throw new Error('Unauthorization');
      }
    },
  },
  adminQuery: {
    type: AdminQueryTC,
    resolve: async (parentValues, args, context) => {
      try {
        return await authentication(context);
      } catch (error) {
        throw new Error('Unauthorization');
      }
    },
  },
  guestQuery: {
    type: GuestQueryTC,
    resolve: async (parentValues, args, context) => '',
  },
});

AdminMutationTC.addFields({
  ...typeComposer.adminMutation,
});
UserMutationTC.addFields({
  ...typeComposer.userMutaion,
});
AdminQueryTC.addFields({
  ...typeComposer.adminQuery,
});
UserQueryTC.addFields({
  ...typeComposer.userQuery,
});
GuestMutationTC.addFields({
  ...typeComposer.guestMutation,
});
GuestQueryTC.addFields({
  ...typeComposer.guestQuery,
});

export const graphqlSchema = GQC.buildSchema();
