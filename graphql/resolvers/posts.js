const Post = require('../../models/Post')

const { checkAuth } = require('../../utils/checkAuth');

module.exports = {
    Query: {
        async getPosts() {
            try {
                const posts = await Post.find().sort({ createdAt: -1 });
                return posts;
            } catch(err) {
                throw new Error(err)
            }
        },

        async getPost(_, { postId }) {
            try {

                if(postId === '') {
                    throw new Error('postId cannot be null');
                }

                const post = await Post.findById(postId);

                if(!post){
                    throw new Error('No posts found');
                }
                
                return post

            } catch(err) {
                throw new Error(err)
            }
        }
    },

    Mutation: {
        async createPost(_, { body }, context) {

            const user = checkAuth(context);

            if(body === '') {
                throw new Error('Body cannot be empty');
            }

            try {
                const newPost = new Post({
                    body,
                    user: user.id,
                    username: user.username,
                    createdAt: new Date().toISOString()
                })

                const post = await newPost.save();

                return post
            } catch(err) {
                throw new Error(err)
            }

        },

        async deletePost(_, { postId }, context) {

            const user = checkAuth(context);

            if(postId === '') {
                throw new Error('PostId cannot be null');
            }

            try {

                const post = await Post.findById(postId);

                if(!post) {
                    throw new Error('No post found');
                }

                if( user.username === post.username ) {

                    await post.delete();
                    return 'Post deleted successfully';

                } else {
                    throw new Error('Not autorized to delete this post');
                }
            } catch(err) {
                throw new Error(err)
            }

        },
        
        async likeUnlikePost(_, { postId }, context) {

            if(postId === ''){
                throw new UserInputError('PostId cannot be empty');
            }

            const user = checkAuth(context);

            try {

                const post = await Post.findById(postId);

                if(post) {

                    if(post.likes.find(like => like.username === user.username)) {

                        post.likes = post.likes.filter(c => c.username !== user.username);

                    } else {

                        post.likes.push({
                            username: user.username,
                            createdAt: new Date().toISOString
                        })
                    }

                    await post.save();
                    return post;

                } else {
                    throw new Error('Post not found')
                }

            } catch(err) {
                throw new Error(err);
            }

        }
    }
}