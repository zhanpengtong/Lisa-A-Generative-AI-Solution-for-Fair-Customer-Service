import OpenAI from 'openai';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use the API Key from your environment variables
});

/**
 * Generate a response from OpenAI based on provided message history.
 * @param {Array} messages - The conversation history in OpenAI's format.
 * @returns {Object} Response object from OpenAI.
 */
export const getGptResponse = async (messages) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
    });

    if (!response || !response.choices || !response.choices[0]?.message) {
      throw new Error('Invalid response from OpenAI');
    }

    return response;
  } catch (err) {
    console.error('Error in OpenAI API:', err.message);
    throw new Error(`OpenAI API error: ${err.message}`);
  }
};

/**
 * Encode a file to Base64 format.
 * @param {string} file - Path to the file to be encoded.
 * @returns {string} Base64 encoded string.
 */
const base64Encode = (file) => {
  try {
    const bitmap = fs.readFileSync(file);
    return Buffer.from(bitmap).toString('base64');
  } catch (err) {
    console.error('Error in base64Encode:', err.message);
    throw new Error('Failed to encode file to Base64');
  }
};

/**
 * Generate a response from OpenAI for image-based prompts.
 * Combines a text message with an image.
 * @param {Array} messages - The conversation history.
 * @param {string} imagePath - Path to the image file.
 * @returns {Object} Response object from OpenAI.
 */
export const getImageResponse = async (messages, imagePath) => {
  try {
    const base64Image = base64Encode(imagePath);

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Describe this image' },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } },
          ],
        },
        ...messages,
      ],
    });

    return response;
  } catch (err) {
    console.error('Error in getImageResponse:', err.message);
    throw new Error('Failed to generate image response');
  }
};
