import http from 'node:http';
import { handle } from './app.js';

const port = Number(process.env.PORT || 3000);
const server = http.createServer(async (req, res) => {
  try { await handle(req, res); }
  catch (error) { console.error(error); res.writeHead(500, { 'content-type': 'application/json' }); res.end(JSON.stringify({ error: 'internal_error' })); }
});
server.listen(port, () => console.log(`MarmoPro Núcleo API listening on :${port}`));
