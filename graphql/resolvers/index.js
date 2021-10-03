const postResolvers = require('./posts');
const userResolvers = require('./users');
const commentResolvers = require('./comments');

module.exports = {
    Post: {
        likesCount(parent) {
            return parent.likes.length
        },
        commentsCount(parent) {
            return parent.comments.length
        }
    },

    Query: {
        ...postResolvers.Query,
    },

    Mutation: {
        ...userResolvers.Mutation,
        ...postResolvers.Mutation,
        ...commentResolvers.Mutation
    }
};