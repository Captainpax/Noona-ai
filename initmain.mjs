import express from 'express';
import './discord/discord.mjs';
import './kavita/kavita.mjs';
import dotenv from 'dotenv';

// Load environment variables from config.env
dotenv.config({path: 'config.env'});

// Initialize Express server
const app = express();
const API_PORT = process.env.API_PORT; // Add fallback port

// Middleware for parsing JSON requests
app.use(express.json());

// Start the Express server
app.listen(API_PORT, () => {
    if (!API_PORT) {
        console.error('API_PORT is not defined in environment variables or missing in config.env');
        process.exit(1);
    }
    console.log(`API server is listening on http://localhost:${API_PORT}`);
});