// wordchain.js
const Discord = require("discord.js");

const games = new Map(); // Store game states here

// Function to start a new game
function startGame(channel) {
    games.set(channel.id, {
        lastWord: null,
        players: new Map(),
    });
    channel.send("Trò chơi nối từ đã bắt đầu! Hãy nhập từ đầu tiên.");
}

// Function to handle word submissions
function handleWordSubmission(message) {
    const game = games.get(message.channel.id);
    if (!game) return;

    const { content, author } = message;
    const lastWord = game.lastWord;

    if (!lastWord || content.startsWith(lastWord[lastWord.length - 1])) {
        game.lastWord = content;
        game.players.set(author.id, (game.players.get(author.id) || 0) + 1);
        message.channel.send(`Từ "${content}" đã được chấp nhận! Từ tiếp theo phải bắt đầu bằng chữ "${content[content.length - 1]}".`);
    } else {
        message.channel.send(`Từ "${content}" không hợp lệ! Phải bắt đầu bằng chữ "${lastWord[lastWord.length - 1]}".`);
    }
}

module.exports = {
    startGame,
    handleWordSubmission,
};
