import { Security } from 'meteor/ongoworks:security';

Security.defineMethod('ownsDocument', {
  fetch: [],
  allow(type, field, userId, doc) {
    return userId === doc[field || 'userId'];
  },
});

export {
  Security,
};
