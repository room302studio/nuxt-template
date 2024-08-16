import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const filePath = path.join(path.dirname(new URL(import.meta.url).pathname), '..', '..', 'src', 'data', 'health-data.json');


export default defineEventHandler(async (event) => {
  
  // extract health data from the event body
  const healthData = await readBody(event)
  let data = [];
  if (fs.existsSync(filePath)) {
    data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }
  data.push(healthData);
  fs.writeFileSync(filePath, JSON.stringify(data));

  return 'Hello Nitro'
})
