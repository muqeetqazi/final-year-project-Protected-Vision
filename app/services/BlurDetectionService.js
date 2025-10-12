import axios from 'axios';
import { Buffer } from 'buffer';

const BASE_URL = 'https://ahmadshafique-no-plate-api.hf.space';

export const detectBlur = async (fileUri, fileType, fileName, model = 'auto', speedMode = 'fast', apiKey) => {
  const formData = new FormData();
  formData.append('file', {
    uri: fileUri,
    name: fileName,
    type: fileType,
  });

  try {
    // Determine the correct endpoint based on model
    let endpoint;
    if (model === 'text') {
      endpoint = '/blur-sensitive-text/';
    } else {
      endpoint = '/blur-detected-multi/';
    }

    // Build URL with parameters
    const fastMode = speedMode === 'fast';
    const url = `${BASE_URL}${endpoint}?model=${encodeURIComponent(model)}&fast_mode=${fastMode}`;
    
    const headers = {
      'Content-Type': 'multipart/form-data',
    };
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    console.log('Making request to:', url);
    console.log('Model:', model, 'Speed:', speedMode, 'Fast Mode:', fastMode);

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
        model: model,
        speedMode: speedMode,
      }
    };
  } catch (error) {
    console.error('Blur detection error:', error);
    throw error;
  }
};

// Default export
export default { detectBlur }; 