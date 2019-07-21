import uuidv4 from 'uuid/v4';

const Mutation = {
  createUser(parent, args, { db }) {
    const emailTaken = db.users.some((user) => user.email === args.data.email);

    if (emailTaken) {
      throw new Error('Email already in use.');
    }

    const user = {
      id: uuidv4(),
      ...args.data,
    };

    db.users.push(user);
    return user;
  },
  deleteUser(parent, args, { db }) {
    const userIndex = db.users.findIndex((user) => user.id === args.id);

    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const deletedUsers = db.users.splice(userIndex, 1);

    db.posts = db.posts.filter((post) => {
      const match = post.author === args.id;

      if (match) {
        db.comments = db.comments.filter((comment) => comment.post !== post.id);
      }

      return !match;
    });

    db.comments = db.comments.filter((comment) => comment.author !== args.id);

    return deletedUsers[0];
  },
  updateUser(parent, args, { db }) {
    const { id, data } = args;

    const user = db.users.find((user) => user.id === id);

    if (!user) {
      throw new Error('User not found');
    }

    if ('string' === typeof data.email) {
      const emailTaken = db.users.some((user) => user.email === data.email);

      if (emailTaken) {
        throw new Error('Email taken');
      }

      if ('' === data.email) {
        throw new Error('No email provided');
      }

      user.email = data.email;
    }

    if ('string' === typeof data.name) {
      if ('' === data.email) {
        throw new Error('No name provided');
      }

      user.name = data.name;
    }

    if ('undefined' !== typeof data.age) {
      user.age = data.age;
    }

    return user;
  },
  createPost(parent, args, { db, pubsub }) {
    const userExist = db.users.some((user) => user.id === args.data.author);

    if (!userExist) {
      throw new Error('User not found');
    }

    const post = {
      id: uuidv4(),
      ...args.data,
    };

    db.posts.push(post);

    if (args.data.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'CREATED',
          data: post,
        }
      });
    }

    return post;
  },
  deletePost(parent, args, { db, pubsub }) {
    const postIndex = db.posts.findIndex((post) => post.id === args.id);

    if (postIndex === -1) {
      throw new Error('Post not found');
    }

    const [post] = db.posts.splice(postIndex, 1);

    db.comments = db.comments.filter((comment) => comment.post !== args.id);

    if (post.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'DELETED',
          data: post
        }
      });
    }

    return post;
  },
  updatePost(parent, args, { db, pubsub }) {
    const { id, data } = args;
    const post = db.posts.find((post) => post.id === id);
    const originalPost = { ...post };

    if (!post) {
      throw new Error('Post not found');
    }

    if ('string' === typeof data.title) {
      if ('' === data.title) {
        throw new Error('No title provided');
      }

      post.title = data.title;
    }

    if ('string' === typeof data.body) {
      if ('' === data.body) {
        throw new Error('No body provided');
      }

      post.body = data.body;
    }

    if ('boolean' === typeof data.published) {
      post.published = data.published;

      if (originalPost.published && !post.published) {
        pubsub.publish('post', {
          post: {
            mutation: 'DELETED',
            data: originalPost
          }
        });
      } else if (!originalPost.published && post.published) {
        pubsub.publish('post', {
          post: {
            mutation: 'CREATED',
            data: post
          }
        });
      }
    } else if (post.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'UPDATED',
          data: post
        }
      });
    }

    return post;

  },
  createComment(parent, args, { db, pubsub }) {
    const userExist = db.users.some((user) => user.id === args.data.author);
    const postExistAndPublished = db.posts.some((post) => post.id === args.data.post && post.published);

    if (!userExist) {
      throw new Error('User not found');
    }

    if (!postExistAndPublished)  {
      throw new Error('Post not found');
    }

    const comment = {
      id: uuidv4(),
      ...args.data,
    };

    db.comments.push(comment);
    pubsub.publish(`comment ${args.data.post}`, {
      comment: {
        mutation: 'CREATED',
        data: comment
      }
    });

    return comment;
  },
  deleteComment(parent, args, { db, pubsub }) {
    const commentIndex = db.comments.findIndex((comment) => comment.id === args.id);

    if (commentIndex === -1) {
      throw new Error('Comment not found');
    }

    const [deletedComment] = db.comments.splice(commentIndex, 1);

    pubsub.publish(`comment ${deletedComment.post}`, {
      comment: {
        mutation: 'DELETED',
        data: deletedComment
      }
    });

    return deletedComment;
  },
  updateComment(parent, args, { db, pubsub }){
    const { id, data } = args;

    const comment = db.comments.find((comment) => comment.id === id);

    if (!comment) {
      throw new Error('Comment not found');
    }

    if ('string' === typeof data.text) {
      if ('' === data.text) {
        throw new Error('No text provided');
      }

      comment.text = data.text;
    }

    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: 'UPDATED',
        data: comment
      }
    });

    return comment;
  },
};

export default Mutation;
