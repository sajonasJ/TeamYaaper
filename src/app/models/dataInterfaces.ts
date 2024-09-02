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
