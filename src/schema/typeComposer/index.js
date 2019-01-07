import { merge } from 'lodash';
import { postTC, resolver as postResolver } from './post';
import { userTC, resolver as userResolver } from './user';
import { profileTC, resolver as profileResolver } from './profile';

export default merge({}, postResolver, userResolver, profileResolver);
