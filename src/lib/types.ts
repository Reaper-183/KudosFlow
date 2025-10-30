export type User = {
  id: string;
  name: string;
  avatarUrl: string;
  team: string;
  role: 'EMPLOYEE' | 'MANAGER' | 'HR' | 'ADMIN';
};

export type Comment = {
  id: string;
  author: User;
  message: string;
  timestamp: string;
};

export type Kudos = {
  id: string;
  sender: User;
  recipient: User;
  message: string;
  emojis: string[];
  privacy: 'PUBLIC' | 'PRIVATE' | 'ANONYMOUS';
  timestamp: string;
  likes: number;
  comments: Comment[];
};
