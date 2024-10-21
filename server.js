import net from 'net';
import { readHeader, writeHeader } from './utils.js';
import { HANDLER_ID, MAX_MESSAGE_LENGTH, TOTAL_LENGTH_SIZE } from './constants.js';
import handlers from './handlers/index.js';

const PORT = 5555;

const server = net.createServer((socket) => {
  console.log(`Client connected : ${socket.remoteAddress}:${socket.remotePort}`);

  // 연결될때 발생되는 이벤트
  socket.on('data', (data) => {
    const buffer = Buffer.from(data);
    const { length, handlerId } = readHeader(buffer);
    console.log(length);
    console.log(handlerId);

    if (length > MAX_MESSAGE_LENGTH) {
      console.error(`Error: Message length ${length}`);
      socket.write(`Errot: Message too long`);
      socket.end();
      return;
    }

    const handler = handlers[handlerId];

    if (!handler) {
      console.error(`Error: No handler found for ID ${handlerId}`);
      socket.write(`Error: Invalid handler ID ${handlerId}`);
      socket.end();
      return;
    }

    const headerSize = TOTAL_LENGTH_SIZE + HANDLER_ID;
    const message = buffer.slice(headerSize);

    console.log(`client message: ${message}`);

    const responseMessage = handler(message);
    const responseBuffer = Buffer.from(responseMessage);

    const header = writeHeader(responseBuffer.length, handlerId);
    const packet = Buffer.concat([header, responseBuffer]);

    socket.write(packet);
  });

  // end와 close와 차이점
  // end는 한쪽만 끊겼을때 발생되는 이벤트
  // close는 양쪽 다 끊겼을때 발생되는 이벤트
  socket.on('end', () => {
    console.log(`Client disconnected : ${socket.remoteAddress}:${socket.remotePort}`);
  });

  // 에러가 발생했을때 발생되는 이벤트
  socket.on('error', (err) => {
    console.log(`Socket error: ${err}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log(server.address());
});
