import { expect } from 'chai';
import { SocketService } from './socket.service'; // Adjust path based on your project structure
import { Message } from '../models/dataInterfaces'; // Adjust path based on your project structure

describe('SocketService', () => {
  let service: SocketService;
  let mockSocket: any; // Use plain object for mocking

  beforeEach(() => {
    // Manually mock the socket object
    mockSocket = {
      emit: (event: string, message: any) => {},
      on: (event: string, callback: Function) => {},
      disconnect: () => {},
    };

    // Manually mock the io function to return the mockSocket
    (global as any).io = () => mockSocket;

    // Initialize the SocketService
    service = new SocketService();
  });

  afterEach(() => {
    // Reset global `io` to prevent side effects in other tests
    delete (global as any).io;
  });

  it('should initialize the socket connection', () => {
    let disconnectCalled = false;

    // Mock the disconnect function
    mockSocket.disconnect = () => {
      disconnectCalled = true;
    };

    const disconnectFn = service.initSocket();

    // Check if the socket is initialized correctly and disconnect can be called
    expect(disconnectFn).to.be.a('function');
    disconnectFn();
    expect(disconnectCalled).to.be.true;
  });

  it('should send a message to the server', () => {
    const mockMessage: Message = {
      _id: '1',
      userId: 'user1',
      senderId: 'user1',
      name: 'Test User',
      text: 'Hello!',
      timestamp: new Date(),
      channelId: 'channel1',
    };

    let emitCalled = false;
    let emittedMessage: any = null;

    // Mock the emit function
    mockSocket.emit = (event: string, message: any) => {
      emitCalled = true;
      emittedMessage = message;
    };

    service.send(mockMessage);

    // Check if the emit method was called with the correct event and message
    expect(emitCalled).to.be.true;
    expect(emittedMessage).to.deep.equal(mockMessage);
  });

  it('should receive a message from the server', (done) => {
    const mockMessage: Message = {
      _id: '1',
      userId: 'user1',
      senderId: 'user1',
      name: 'Test User',
      text: 'Hello!',
      timestamp: new Date(),
      channelId: 'channel1',
    };

    // Mock the on function to simulate receiving a message
    mockSocket.on = (event: string, callback: Function) => {
      if (event === 'message') {
        callback(mockMessage);
      }
    };

    // Subscribe to the onMessage observable and check the received message
    service.onMessage().subscribe((message) => {
      expect(message).to.deep.equal(mockMessage);
      done();  // Complete the test when message is received
    });
  });
});
