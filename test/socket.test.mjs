import { expect } from 'chai';
import { io } from 'socket.io-client';
import { Server } from 'socket.io';
import http from 'http';
import { connect } from '../server/sockets.js'; // Adjust to your path
import { ObjectId } from 'mongodb'; // Ensure this is imported correctly

const PORT = 3001;
const socketURL = `http://localhost:${PORT}`;
let httpServer, ioServer;

describe('Socket.IO Server', function () {
  this.timeout(10000); // Increase timeout to 10 seconds

  let clientSocket;
  let mockMongoDb, mockCollection;

  before((done) => {
    httpServer = http.createServer();
    ioServer = new Server(httpServer);

    // Mock MongoDB collection and its updateOne method
    mockCollection = async function (query, update) {
      expect(query).to.deep.equal({
        _id: new ObjectId('123456789012345678901234'),
        'channels.name': 'general',
      });
      expect(update).to.deep.equal({
        $push: {
          'channels.$.messages': {
            userId: new ObjectId('1'),
            name: 'Test User',
            text: 'Hello World',
            timestamp: update.$push['channels.$.messages'].timestamp, // Don't compare exact time
          },
        },
      });
      return { modifiedCount: 1 };
    };

    // Mock MongoDB
    mockMongoDb = {
      collection: function () {
        return { updateOne: mockCollection };
      },
    };

    // Start the server
    connect(ioServer, PORT, mockMongoDb);

    // Start the server and client socket connection
    httpServer.listen(PORT, () => {
      clientSocket = io(socketURL);
      clientSocket.on('connect', () => {
        console.log('Client connected:', clientSocket.id);
        done(); // Ensure done is called after connection
      });
    });
  });

  after(() => {
    clientSocket.close();
    ioServer.close();
    httpServer.close();
  });

  it('should log a connection message', (done) => {
    // Check if the client is connected
    clientSocket.once('connect', () => {
      expect(clientSocket.id).to.exist;
      console.log('Connection test passed');
      done(); // Call done when test completes
    });
  });

  it('should emit and save the message to MongoDB', (done) => {
    // Expect the server to return a message
    clientSocket.on('message', (msg) => {
      try {
        // Test the message received back from the server
        expect(msg).to.have.property('userId', '1');
        expect(msg).to.have.property('name', 'Test User');
        expect(msg).to.have.property('text', 'Hello World');
        console.log('Message received and validated');
        done(); // Call done when the message is processed
      } catch (err) {
        done(err); // Call done with an error if the expectations fail
      }
    });

    // Emit a message from the client to the server
    clientSocket.emit('message', {
      groupId: '123456789012345678901234',
      channelName: 'general',
      userId: '1',
      name: 'Test User',
      text: 'Hello World',
    });
  });
});
