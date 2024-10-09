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
  userId: string;
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
  admins: string[];
  users: string[];
  channels: Channel[];
  joinRequests?: JoinRequest[];
}

export interface User {
  _id?: string;
  id?: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  roles: string[];
  groups: string[];
  joinRequests?: string[];
  profilePictureUrl?: String;
}

export interface JoinRequest {
  username: string;
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
