import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { Message } from '../models/dataInterfaces';

const SERVER_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket!: Socket;

  constructor() {}

  initSocket() {
    this.socket = io(SERVER_URL);
    return () => {
      this.socket.disconnect();
    };
  }

  // Send a properly structured Message object
  send(message: Message) {
    console.log('Sending message to server:', message);
    this.socket.emit('message', message);
  }

  // Receive a Message object from the server
  onMessage(): Observable<Message> {
    return new Observable<Message>((observer) => {
      this.socket.on('message', (data: Message) => {
        console.log('Message received from server:', data);
        observer.next(data); // Pass the Message object to subscribers
      });
    });
  }
}
