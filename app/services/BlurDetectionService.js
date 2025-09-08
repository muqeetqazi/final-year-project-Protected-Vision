import axios from 'axios';
import { Buffer } from 'buffer';
const BASE_URL = 'https://ahmadshafique-no-plate-api.hf.space/blur-detected-multi/';

export const detectBlur = async (fileUri, fileType, fileName, model = 'auto', apiKey) => {
  const formData = new FormData();
  formData.append('file', {
    uri: fileUri,
    name: fileName,
    type: fileType,
  });

  try {
    const url = `${BASE_URL}?model=${encodeURIComponent(model)}`;
    const headers = {
      'Content-Type': 'multipart/form-data',
    };
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const response = await axios.post(url, formData, {
      headers,
      responseType: 'arraybuffer',
    });
    const base64 = Buffer.from(response.data, 'binary').toString('base64');
    const detectionTypes = response.headers['x-detection-types'] || response.headers['X-Detection-Types'];
    const detections = response.headers['x-detections'] || response.headers['X-Detections'];
    const processingTime = response.headers['x-processing-time'] || response.headers['X-Processing-Time'];
    return {
      base64,
      meta: {
        detectionTypes: detectionTypes ? Number(detectionTypes) : 0,
        detections: detections ? Number(detections) : 0,
        processingTime: processingTime || null,
      }
    };
  } catch (error) {
    throw error;
  }
}; 