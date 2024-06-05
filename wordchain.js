const Discord = require("discord.js");

class WordChainGame {
    constructor(channel) {
        this.channel = channel;
        this.players = [];
        this.words = [];
        this.currentWord = '';
        this.turn = 0;
        this.inProgress = false;
    }

    startGame() {
        if (this.inProgress) {
            this.channel.send("Trò chơi đã bắt đầu rồi!");
            return;
        }

        this.inProgress = true;
        this.channel.send("Trò chơi nối từ đã bắt đầu!");

        // Gửi lời mời đầu tiên
        this.sendTurnMessage();
    }

    addPlayer(player) {
        this.players.push(player);
    }

    sendTurnMessage() {
        this.channel.send(`Lượt của ${this.players[this.turn].username}, hãy nối từ với từ cuối cùng là **${this.currentWord}**`);
    }

    processWord(word) {
        if (!this.inProgress) return;

        // Kiểm tra xem từ có hợp lệ không
        if (!this.isValidWord(word)) {
            this.channel.send("Từ không hợp lệ hoặc đã được sử dụng, vui lòng thử lại!");
            return;
        }

        // Kiểm tra xem từ này có bắt đầu bằng ký tự của từ cuối cùng không
        if (!this.currentWord || word[0] === this.currentWord[this.currentWord.length - 1]) {
            this.words.push(word);
            this.currentWord = word;
            this.turn = (this.turn + 1) % this.players.length;
            this.sendTurnMessage();
        } else {
            this.channel.send("Từ phải bắt đầu bằng ký tự của từ cuối cùng!");
        }
    }

    isValidWord(word) {
        // Kiểm tra từ đã được sử dụng chưa
        if (this.words.includes(word)) return false;

        // Thêm các quy tắc kiểm tra từ hợp lệ ở đây nếu cần
        return true;
    }

    endGame() {
        this.channel.send("Trò chơi kết thúc!");
        this.resetGame();
    }

    resetGame() {
        this.players = [];
        this.words = [];
        this.currentWord = '';
        this.turn = 0;
        this.inProgress = false;
    }
}

module.exports = WordChainGame;
