export interface Channel {
  id?: string;
  _id?: string;
  name: string;
  description: string;
  messages: Message[];
  users: string[];
}

export interface Message {
  _id?: string;
  senderId: string;
  name: string;
  text: string;
  timestamp: Date;
  channelId?: string;
}

export interface Group {
  _id?: string;
  name: string;
  description: string;
  admins: string[]; // Array of user IDs or usernames who are admins
  users: string[]; // Array of user IDs or usernames who are users
  channels: Channel[]; // Array of Channel objects
  joinRequests?: JoinRequest[]; // Optional: Array of join requests for this group
}

export interface User {
  _id?: string;
  id?: string; 
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  roles: string[]; // e.g., ['admin', 'user']
  groups: string[];
  joinRequests?: string[]; // Optional: Array of IDs of the groups that the user has requested to join
  profilePicture?: String, 
}

export interface JoinRequest {
  _id?: string;
  groupId: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: Date;

  userDetails?: {
    username: string;
    firstname: string;
    lastname: string;
  };
}
