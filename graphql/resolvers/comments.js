const { UserInputError } = require('apollo-server');
const Post = require('../../models/Post');

const { checkAuth } = require('../../utils/checkAuth');

module.exports = { 
    Mutation: {
        async createComment(_, { postId, body }, context) {
            if(body.trim() === '') {
                throw new UserInputError('Comment body cannot be empty');
            }

            if(postId === '') {
                throw new UserInputError('PostId cannot be empty');
            }

            const user = checkAuth(context);

            try {
                const post = await Post.findById(postId);

                if(post) {
                    post.comments.unshift({
                        body,
                        username: user.username,
                        createdAt: new Date().toISOString()
                    })

                    try {
                        await post.save();
                        return post;
                    } catch(err) {
                        throw new Error(err);
                    }
                } else throw new Error('Post not found');

            } catch(err) {
                throw new Error(err);
            }
        },

        async deleteComment(_, { postId, commentId }, context) {

            if(postId === '') {
                throw new UserInputError('PostId cannot be empty');
            }

            if(commentId === '') {
                throw new UserInputError('CommentId cannot be empty');
            }

            const user = checkAuth(context);

            try {
                const post = await Post.findById(postId);

                if(post) {

                    const commentIndex = post.comments.findIndex(c => c.id === commentId);

                    if(commentIndex >=0 ) {

                        if(post.comments[commentIndex].username === user.username) {
                            post.comments.splice(commentIndex, 1)
                            await post.save();
                            return post;
                        } else {
                            throw new Error('Not Authroized to perform given action');
                        }

                    } else throw new UserInputError('Comment not found');

                } else throw new UserInputError('Post not found');

            } catch(err) {
                throw new Error(err)
            }


        }
    }
}