import { merge } from 'lodash';
import { profileTC, resolver as profileResolver } from './profile';
import { postTC, resolver as postResolver } from './post';
import { userTC, resolver as userResolver } from './user';


profileTC.addRelation('onwer', {
  resolver: () => profileTC.getResolver('findById'),
  prepareArgs: {
    _id: source => source.profileId,
  },
  projection: {
    profileId: 1,
  },
});

profileTC.addRelation('friends', {
  resolver: () => profileTC.getResolver('findByIds'),
  prepareArgs: {
    _ids: source => source.friendIds,
  },
  projection: {
    friendIds: 1,
  },
});

profileTC.addRelation('pendingFriends', {
  resolver: () => profileTC.getResolver('findByIds'),
  prepareArgs: {
    _ids: source => source.pendingFriendIds,
  },
  projection: {
    pendingFriendIds: 1,
  },
});

profileTC.addRelation('user', {
  resolver: () => userTC.getResolver('findById'),
  prepareArgs: {
    _id: source => source.userId,
  },
  projection: {
    userId: 1,
  },
});

export default merge({}, postResolver, userResolver, profileResolver);
