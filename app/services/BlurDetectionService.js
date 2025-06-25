import axios from 'axios';
import { Buffer } from 'buffer';
const API_URL = 'https://ahmadshafique-no-plate-api.hf.space/blur-detected/';

export const detectBlur = async (imageUri) => {
  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    name: 'image.jpg',
    type: 'image/jpeg',
  });

  try {
    const response = await axios.post(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'arraybuffer',
    });
    const base64 = Buffer.from(response.data, 'binary').toString('base64');
    return base64;
  } catch (error) {
    throw error;
  }
}; 