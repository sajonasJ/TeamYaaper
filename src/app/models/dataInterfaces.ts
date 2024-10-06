export interface Channel {
  id?: string;
  name: string;
  description: string;
  messages: Message[];
  users: string[];
}

export interface Message {
  senderId: string; 
  name: string;
  text: string;
  timestamp: Date;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  admins: string[]; // Array of user IDs or usernames who are admins
  users: string[]; // Array of user IDs or usernames who are users
  channels: Channel[]; // Array of Channel objects
  joinRequests?: JoinRequest[]; // Optional: Array of join requests for this group
}

export interface User {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  roles: string[]; // e.g., ['admin', 'user']
  groups: string[];
  joinRequests?: string[]; // Optional: Array of IDs of the groups that the user has requested to join
}

export interface JoinRequest {
  id: string;
  groupId: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: Date;
}
