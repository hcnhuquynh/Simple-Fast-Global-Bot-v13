const Discord = require("discord.js");

const wordChainChannelId = '1245357473267716137';
let currentWord = '';
let usedWords = [];

function isValidWord(word) {
    // Ensure the word has 2 characters and starts with the last character of the previous word
    return word.length === 4 && (currentWord === '' || word.startsWith(currentWord.slice(-2)));
}

function startGame(channel) {
    currentWord = '';
    usedWords = [];
    channel.send("Trò chơi nối từ bắt đầu! Hãy nhập từ 2 chữ đầu tiên.");
}

module.exports = (client) => {
    client.on('messageCreate', (message) => {
        if (message.channel.id !== wordChainChannelId || message.author.bot) return;

        const content = message.content.trim();
        
        if (content === '!start') {
            startGame(message.channel);
            return;
        }

        if (isValidWord(content) && !usedWords.includes(content)) {
            usedWords.push(content);
            currentWord = content;
            message.channel.send(`Từ "${content}" đã được chấp nhận. Hãy nhập từ tiếp theo bắt đầu bằng "${content.slice(-2)}".`);
        } else {
            message.channel.send(`Từ "${content}" không hợp lệ hoặc đã được sử dụng. Hãy thử lại.`);
        }
    });
};
