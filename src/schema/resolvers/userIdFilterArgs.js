import _ from 'lodash';

export function userIdFilterArgs(typeCompose, resolvers) {
  resolvers.forEach((resolver) => {
    typeCompose.setResolver(
      resolver,
      typeCompose.getResolver(resolver).wrapResolve(next => (rp) => {
        if (_.get(rp, 'context.decoded._id', null)) {
          _.set(rp, 'args.filter.userId', rp.context.decoded._id);
          return next(rp);
        }
        throw new Error('Require correct user id');
      }),
    );
  });
}
