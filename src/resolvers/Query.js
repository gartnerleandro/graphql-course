const Query = {
  users(parent, args, { db }) {
    if (!args.query) {
      return db.users;
    }

    return db.users.filter((user) => user.name.toLowerCase().includes(args.query.toLowerCase()));
  },
  posts(parent, args, { db }) {
    if (!args.query) {
      return db.posts;
    }

    return db.posts.filter((post) => post.title.toLowerCase().includes(args.query.toLowerCase()) || post.body.toLowerCase().includes(args.query));
  },
  comments(parent, args, { db }) {
    return db.comments;
  },
  me() {
    return {
      id: '1223344',
      name: 'Leandro',
      email: 'leandro@example.com',
      age: 23,
    };
  },
  post() {
    return {
      id: '123098',
      title: 'Post title',
      body: 'Post body',
      published: true,
    };
  }
};

export default Query;
