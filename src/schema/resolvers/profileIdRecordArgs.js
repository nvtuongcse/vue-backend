import _ from 'lodash';

export function profileIdRecordArgs(typeCompose, resolvers) {
  resolvers.forEach((resolver) => {
    typeCompose.setResolver(
      resolver,
      typeCompose.getResolver(resolver).wrapResolve(next => (rp) => {
        if (_.get(rp, 'context.decoded.profileId', null)) {
          _.set(rp, 'args.record.profileId', rp.context.decoded.profileId);
          return next(rp);
        }
        throw new Error('Require correct profile Id');
      }),
    );
  });
}
