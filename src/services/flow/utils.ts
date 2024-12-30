import * as path from 'path';

export const getScriptFromFile = async (filename: string): Promise<string> => {
  try {
    const response = await fetch(`/src/services/flow/scripts/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to load script ${filename}`);
    }
    return await response.text();
  } catch (error) {
    console.error(`Error loading script ${filename}:`, error);
    throw error;
  }
};
