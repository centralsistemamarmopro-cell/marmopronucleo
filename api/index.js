import { handle } from '../server/app.js';

export default async function handler(req, res) {
  await handle(req, res);
}
