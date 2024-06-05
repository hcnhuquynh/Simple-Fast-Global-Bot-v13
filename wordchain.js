// wordchain.js

const wordChains = new Map();

const startGame = (message) => {
    const channelId = message.channel.id;
    if (wordChains.has(channelId)) {
        return message.channel.send("Đã có một trò chơi đang diễn ra trong kênh này!");
    }

    wordChains.set(channelId, {
        words: [],
        currentWord: null
    });

    message.channel.send("Trò chơi nối từ bắt đầu! Hãy bắt đầu với một từ bất kỳ.");
};

const playGame = (message) => {
    const channelId = message.channel.id;
    if (!wordChains.has(channelId)) {
        return message.channel.send("Chưa có trò chơi nào đang diễn ra. Hãy bắt đầu trò chơi bằng lệnh `!start`.");
    }

    const game = wordChains.get(channelId);
    const newWord = message.content.trim();

    if (game.currentWord) {
        const lastTwoChars = game.currentWord.slice(-2);
        const firstTwoChars = newWord.slice(0, 2);

        if (lastTwoChars !== firstTwoChars) {
            return message.channel.send(`Từ của bạn không hợp lệ. Từ cuối cùng là "${game.currentWord}". Hãy bắt đầu từ với "${lastTwoChars}".`);
        }
    }

    game.words.push(newWord);
    game.currentWord = newWord;
    message.channel.send(`Từ hợp lệ! Từ tiếp theo phải bắt đầu bằng "${newWord.slice(-2)}".`);
};

const endGame = (message) => {
    const channelId = message.channel.id;
    if (!wordChains.has(channelId)) {
        return message.channel.send("Chưa có trò chơi nào đang diễn ra.");
    }

    wordChains.delete(channelId);
    message.channel.send("Trò chơi đã kết thúc.");
};

module.exports = {
    startGame,
    playGame,
    endGame
};
