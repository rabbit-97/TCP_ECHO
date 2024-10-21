import net from 'net';
import { readHeader, writeHeader } from './utils.js';
import { HANDLER_ID, TOTAL_LENGTH_SIZE } from './constants.js';

const HOST = 'localhost';
const PORT = 5555;

const client = new net.Socket();

client.connect(PORT, HOST, () => {
  console.log('connected to server');

  //   const longMessage = 'V'.repeat(1024);
  //   const buffer = Buffer.from(longMessage);

  const message = 'Hello';
  const buffer = Buffer.from(message);

  const header = writeHeader(buffer.length, 11);
  const packet = Buffer.concat([header, buffer]);
  client.write(packet);
});

client.on('data', (data) => {
  const buffer = Buffer.from(data);
  const { length, handlerId } = readHeader(buffer);
  console.log(length);
  console.log(handlerId);

  const headerSize = TOTAL_LENGTH_SIZE + HANDLER_ID;
  const message = buffer.slice(headerSize);
  console.log(`server message: ${message}`);
});

client.on('close', () => {
  console.log('Connection closed');
});

client.on('error', (err) => {
  console.error('Client error:', err);
});
