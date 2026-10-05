import { getCollection } from './mongodb';
import bcrypt from 'bcryptjs';

export interface UserDocument {
  _id?:         string;
  email:        string;
  passwordHash: string;
  name:         string;
  plan:         'free' | 'premium';
  language:     string;
  createdAt:    Date;
  preferences: {
    theme:      'light' | 'dark' | 'system';
    layout:     'list' | 'grid' | 'magazine';
    fontSize:   'sm' | 'md' | 'lg' | 'xl';
    categories: string[];
    notifications: {
      push:         boolean;
      email:        boolean;
      breakingNews: boolean;
      digest:       'never' | 'daily' | 'weekly';
    };
  };
  savedArticles: string[];
}

export async function getUsersCollection() {
  return getCollection<UserDocument>('users');
}

export async function findUserByEmail(email: string) {
  const col = await getUsersCollection();
  return col.findOne({ email: email.toLowerCase() });
}

export async function createUser(data: {
  name:     string;
  email:    string;
  password: string;
}) {
  const col          = await getUsersCollection();
  const passwordHash = await bcrypt.hash(data.password, 12);

  const user: UserDocument = {
    email:        data.email.toLowerCase(),
    passwordHash,
    name:         data.name,
    plan:         'free',
    language:     'fr',
    createdAt:    new Date(),
    preferences: {
      theme:    'light',
      layout:   'list',
      fontSize: 'md',
      categories: [],
      notifications: {
        push:         false,
        email:        true,
        breakingNews: true,
        digest:       'daily',
      },
    },
    savedArticles: [],
  };

  const result = await col.insertOne(user);
  return { ...user, _id: result.insertedId.toString() };
}

export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}
