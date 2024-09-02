export interface Channel {
  id: string;
  name: string;
  description: string;
  messages: Message[];
}

export interface Message {
  name: string;
  text: string;
  timestamp: Date;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  superuser: string[];
  admins: string[];
  users: string[];
  channels: Channel[];
}

export interface User {
  id: string | number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  roles: string[];
  groups: { [key: string]: string[] };
}
