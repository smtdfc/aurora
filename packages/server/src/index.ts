import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Fastify from 'fastify'
import http from 'http'
import initSocket from './socket/index.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "../.env")
});

const fastify = Fastify({ logger: true })
const server = http.createServer(fastify.server)
initSocket(server);

fastify.get('/', async (req, reply) => {
  return { status: 'OK' }
})

server.listen(process.env.PORT, () => {
  console.log('Server running at port ', process.env.PORT)
})