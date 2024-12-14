import { json } from '@sveltejs/kit';
import { promises as fs } from 'fs';
import path from 'path';

const filePath = path.resolve('static/data/Conversations.json');

export async function POST({ request }) {
  try {
    const newData = await request.json();
    console.warn(filePath)
    const dirPath = path.dirname(filePath);

    // Ensure the directory exists
    await fs.mkdir(dirPath, { recursive: true });

    let existingData = [];

    try {
      // Check if the file exists and read it
      await fs.access(filePath);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      existingData = JSON.parse(fileContent);
    } catch (error:any) {
      if (error.code !== 'ENOENT') throw error; // Rethrow unexpected errors
      console.log('File does not exist. Creating a new file.');
    }

    // Append new data
    existingData.push(newData);

    // Write back to the JSON file
    await fs.writeFile(filePath, JSON.stringify(existingData, null, 2));

    return json({ success: true, message: 'Data written successfully' });
  } catch (error:any) {
    console.error('Error processing request:', error);
    return json({ success: false, error: error.message }, { status: 500 });
  }
}
