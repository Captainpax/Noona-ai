import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({path: 'config.env'});

// Kavita API details
const KAVITA_API_BASE_URL = process.env.KAVITA_API_BASE_URL;
const KAVITA_API_USERNAME = process.env.KAVITA_API_USERNAME;
const KAVITA_API_PASSWORD = process.env.KAVITA_API_PASSWORD;

//Check connectivity to Kavita server
(async () => {
    try {
        if (!KAVITA_API_BASE_URL || !KAVITA_API_USERNAME || !KAVITA_API_PASSWORD) {
            console.error('Error: Missing required environment variables. Please check config.env file.');
            return;
        }
        console.log(`Environment variables loaded successfully. Base URL: ${KAVITA_API_BASE_URL}`);

        console.log('Testing base URL connectivity...');
        const baseUrlTest = await axios.get(`${KAVITA_API_BASE_URL}`).catch(err => err);
        if (!baseUrlTest || baseUrlTest.status !== 200) {
            console.error(`Error: Failed to connect to the base URL (${KAVITA_API_BASE_URL}). Status: ${baseUrlTest?.status || 'unknown'}, Message: ${baseUrlTest?.message || 'None'}`);
            baseUrlTest?.response && console.error(`Response data: ${JSON.stringify(baseUrlTest.response.data)}`);
            return;
        }
        console.log('Base URL is reachable.');

        console.log('Attempting to sign in to Kavita server...');
        const response = await axios.post(
            `${KAVITA_API_BASE_URL}/api/Account/SignIn`,
            {
                username: KAVITA_API_USERNAME,
                password: KAVITA_API_PASSWORD,
            }
        ).catch(err => {
            console.error('Error occurred during sign-in request:', err.message);
            return err.response;
        });

        if (!response || !response.data || !response.data.token) {
            console.error('Error: Sign-in failed. No token received.');
            if (response?.status) {
                console.error(`Sign-in response status: ${response.status}`);
                console.error(`Sign-in response data: ${JSON.stringify(response.data || {})}`);
            } else {
                console.error('Sign-in request did not receive a valid response from the server.');
            }
            return;
        }
        console.log('Sign-in successful. Token received.');
        if (response.data.token) {
            console.log('Token successfully retrieved. Validating further actions.');
        }

        const token = response.data.token;
        console.log(`Token received: ${token.substring(0, 10)}... [Truncated for security]`);

        console.log('Attempting to fetch library data...');
        const libraryResponse = await axios.get(
            `${KAVITA_API_BASE_URL}/api/Library`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        ).catch(err => {
            console.error('Error occurred while fetching library data:', err.message);
            return err.response;
        });

        if (!libraryResponse || libraryResponse.status !== 200) {
            console.error(`Error: Failed to fetch library data. Status: ${libraryResponse?.status || 'unknown'}, Message: ${libraryResponse?.statusText || 'None'}`);
            libraryResponse?.data && console.error(`Response data: ${JSON.stringify(libraryResponse.data)}`);
            return;
        }
        console.log('Successfully connected to Kavita server and fetched library data.');
        console.log(`Library data: ${JSON.stringify(libraryResponse.data, null, 2)}`);
    } catch (error) {
        console.error(
            'Critical Error: Failed to connect to the Kavita server:',
            error.message,
        );
        if (error.response) {
            console.error(`Error response status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}`);
        } else {
            console.error('No response received from the server.');
        }
    }
})();