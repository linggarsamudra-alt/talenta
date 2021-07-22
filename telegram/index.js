module.exports = {

    defaultCommand: (bot) => {

        bot.on('message', (msg) => {
            const chatId = msg.chat.id;
            bot.sendMessage(chatId, 'Received your message');
        });

    },

};
