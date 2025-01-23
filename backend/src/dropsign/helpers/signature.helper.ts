import axios from 'axios';
import * as FormData from 'form-data';
import * as dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.DROPBOX_SIGN_API_KEY;
// console.log(API_KEY);
const DROPBOX_SIGN_API_URL = 'https://api.hellosign.com/v3'; // Dropbox Sign API endpoint

export async function createSignatureRequest({ participants, base64Content }) {
  try {
    if (!API_KEY) {
      throw new Error('Missing Dropbox Sign API key');
    }

    const payload = new FormData();
    payload.append('title', 'Please sign this agreement'); // Title of the document
    payload.append('subject', 'Agreement Signing Request'); // Subject of the email
    payload.append('message', 'Please sign this document to proceed.'); // Message to be included in the email
    payload.append('test_mode', '1'); // Set to '1' for testing mode, set to '0' for production

    // Add participants as signers
    participants.forEach((participant, index) => {
      payload.append(`signers[${index}][email_address]`, participant.email);
      payload.append(`signers[${index}][name]`, participant.name);
      payload.append(`signers[${index}][order]`, index + 1);
    });

    // Convert base64 content to buffer for file processing
    const base64Parts = base64Content.split(',');
    if (base64Parts.length !== 2 || !base64Parts[0].includes('application/pdf')) {
      throw new Error('Invalid base64 content. Ensure it includes a valid MIME type.');
    }

    const fileBuffer = Buffer.from(base64Parts[1], 'base64');
    payload.append('file[0]', fileBuffer, { filename: 'document.pdf', contentType: 'application/pdf' });

    // Set the authorization header with the API key encoded in base64
    const headers = {
      Authorization: `Basic ${Buffer.from(API_KEY + ':').toString('base64')}`,
      ...payload.getHeaders(),
    };

    // Send the request to Dropbox Sign API
    const response = await axios.post(
      `${DROPBOX_SIGN_API_URL}/signature_request/send`, // Endpoint for sending signature requests
      payload,
      { headers }
    );

    return response.data; // Return the response data
  } catch (error) {
    console.error('Error in createSignatureRequest:', error.message);
    if (error.response?.data) {
      console.error('Dropbox API Error Details:', error.response.data);
    }
    throw new Error(`Failed to send signature request: ${error.response?.data?.error || error.message}`);
  }
}

