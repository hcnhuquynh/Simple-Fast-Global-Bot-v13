const { MessageEmbed } = require('discord.js');

let activeGames = {}; // Store active games by channel ID

module.exports = (client) => {
    client.on('messageCreate', async (message) => {
        if (message.author.bot) return;

        const prefix = '!'; // You can change this to any prefix you want

        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        if (command === 'startwordchain') {
            if (activeGames[message.channel.id]) {
                return message.reply('A game is already in progress in this channel!');
            }
            activeGames[message.channel.id] = {
                lastWord: null,
                player: null
            };
            return message.channel.send('Word chain game started! Type a word to begin.');
        }

        if (command === 'endwordchain') {
            if (!activeGames[message.channel.id]) {
                return message.reply('There is no active game in this channel!');
            }
            delete activeGames[message.channel.id];
            return message.channel.send('Word chain game ended!');
        }

        if (activeGames[message.channel.id]) {
            const game = activeGames[message.channel.id];
            const word = message.content.trim().toLowerCase();

            // If no last word, start the chain
            if (!game.lastWord) {
                game.lastWord = word;
                game.player = message.author.id;
                return message.channel.send(`Starting word chain with: **${word}**`);
            }

            // Check if the word is valid
            if (word.length === 0) {
                return message.reply('Please provide a valid word.');
            }

            if (game.player === message.author.id) {
                return message.reply('Wait for another player to respond!');
            }

            const lastWord = game.lastWord.split(' ');
            const newWord = word.split(' ');

            if (lastWord[lastWord.length - 1] !== newWord[0]) {
                return message.reply(`Invalid word! The word should start with **${lastWord[lastWord.length - 1]}**`);
            }

            game.lastWord = word;
            game.player = message.author.id;
            return message.channel.send(`Next word: **${word}**`);
        }
    });
};
