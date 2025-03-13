import {Client, GatewayIntentBits} from 'discord.js';
import dotenv from 'dotenv';

dotenv.config({path: 'config.env'});

// Initialize Discord bot
const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// Replace with your Discord bot token
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

// Bot 'ready' event
bot.once('ready', () => {
    console.log(`Discord bot logged in as ${bot.user.tag}`);
});

// Message event: Respond to "!ding" with "Dong!"
bot.on('messageCreate', (message) => {
    if (message.content.toLowerCase() === '!ding') {
        message.reply('Dong!');
    }
});

// Log in the bot
bot.login(DISCORD_BOT_TOKEN).catch((err) => {
    console.error('Failed to login to Discord bot:', err.message);
});