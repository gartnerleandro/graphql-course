const posts = [
  {
    id: '10',
    title: 'Title 1',
    body: 'body 1',
    published: true,
    author: '1',
  },
  {
    id: '20',
    title: 'Title 2',
    body: 'body 2',
    published: false,
    author: '1',
  },
  {
    id: '30',
    title: 'Title 3',
    body: 'body 3',
    published: true,
    author: '2',
  },
];

const users = [
  {
    id: '1',
    name: 'Leandro',
    email: 'leandro@example.com',
    age: 23,
  },
  {
    id: '2',
    name: 'Sarah',
    email: 'sarah@example.com',
  },
  {
    id: '3',
    name: 'Mike',
    email: 'mike@example.com',
  },
];

const comments = [
  {
    id: '21',
    text: 'First comment',
    author: '1',
    post: '10',
  },
  {
    id: '22',
    text: 'Second comment',
    author: '2',
    post: '10',
  },
  {
    id: '23',
    text: 'Third comment',
    author: '2',
    post: '10',
  },
  {
    id: '24',
    text: 'It works!',
    author: '3',
    post: '20',
  },
];

const db = {
  users,
  posts,
  comments,
};

export default db;
