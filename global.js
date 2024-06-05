const Discord = require("discord.js");
const globalChannels = [
    "1245681386648506480",
    "1216985264069541932" // UNAVAILABLE CHANNEL
]; // Define an array of all channels which are global channels

const staffIds = ["1015763488938938388", "1055695302386012212"]; // Replace with actual staff member IDs
const botStaffIds = ["1112683447366991923"]; // Replace with actual staff bot IDs
const partneredServerIds = ["1079700191634014298"]; // Replace with actual partnered server IDs
const ownerIds = ["1143200917097808044"]; // Replace with actual owner IDs

function getRandomColor() {
    const colors = [
        "RED", "ORANGE", "YELLOW", "GREEN", "BLUE", "PURPLE", "PINK", "WHITE", "BLACK"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

module.exports = client => {
    // First some supportive buttons!
    let buttonrow = new Discord.MessageActionRow().addComponents([
        new Discord.MessageButton().setStyle("LINK").setURL("https://discord.gg/milrato").setLabel("Support Server"),
        new Discord.MessageButton().setStyle("LINK").setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`).setLabel("Invite me")
    ]);

    client.on("messageCreate", async message => {
        // Return if a message is received from DMs, or an invalid guild, or from a BOT!
        if (!message.guild || message.guild.available === false || message.author.bot) return;

        // If the current channel is a global channel:
        if (globalChannels.includes(message.channel.id)) {
            const messageData = {
                embeds: [],
                components: [buttonrow],
                files: []
            };

            const embed = new Discord.MessageEmbed()
                .setColor(getRandomColor())
                .setAuthor(`${message.author.tag}`, message.member.displayAvatarURL({ dynamic: true, size: 256 }), "https://discord.gg/milrato")
                .setThumbnail(message.member.displayAvatarURL({ dynamic: true, size: 256 }))
                .setFooter(`${message.guild.name}・${message.guild.memberCount} Members`, message.guild.iconURL({ dynamic: true, size: 256 }))
                .setTimestamp();

            let messageContent = String(message.content).substr(0, 2000);

            // Check if the message author is the owner and color the text green
            if (ownerIds.includes(message.author.id)) {
                embed.setDescription(`**Message:**\n\n>>> \`\`\`diff\n+ ${messageContent}\`\`\``);
            } else if (staffIds.includes(message.author.id) || botStaffIds.includes(message.author.id) || partneredServerIds.includes(message.guild.id)) {
                embed.setDescription(`**Message:**\n\n>>> \`\`\`yaml\n${messageContent}\`\`\``);
            } else {
                embed.setDescription(`**Message:**\n\n>>> ${messageContent}`);
            }

            // Add icons for staff, bot staff, and partnered servers
            if (staffIds.includes(message.author.id)) {
                embed.setDescription(`<:hg_king:1080873872578064444> ${embed.description}`);
            }
            if (ownerIds.includes(message.author.id)) {
                embed.setDescription(`<:hg_king:1080873872578064444> ${embed.description}`);
            }
            if (botStaffIds.includes(message.author.id)) {
                embed.setDescription(`<:staff:1091010733589930124> ${embed.description}`);
            }
            if (partneredServerIds.includes(message.guild.id)) {
                embed.setDescription(`<:hg_partner:1212043431459819540> ${embed.description}`);
            }

            // Attachments
            let url = "";
            let imagename = "UNKNOWN";
            if (message.attachments.size > 0) {
                if (message.attachments.every(attachIsImage)) {
                    const attachment = new Discord.MessageAttachment(url, imagename);
                    messageData.files = [attachment];
                    embed.setImage(`attachment://${imagename}`);
                }
            }
            function attachIsImage(msgAttach) {
                url = msgAttach.url;
                imagename = msgAttach.name || `UNKNOWN`;
                return url.match(/\.(png|jpeg|gif|webp|webm|jpg)$/i);
            }

            messageData.embeds = [embed];
            sendallGlobal(message, messageData);
        }
    });

    async function sendallGlobal(message, messageData) {
        message.react("🌐").catch(() => {});
        let notincachechannels = [];
        message.channel.send(messageData).then(msg => {}).catch(() => {});

        for (const chid of globalChannels) {
            let channel = client.channels.cache.get(chid);
            if (!channel) {
                notincachechannels.push(chid);
                continue;
            }
            if (channel.guild.id != message.guild.id) {
                channel.send(messageData).then(msg => {}).catch(() => {});
            }
        }

        for (const chid of notincachechannels) {
            let channel = await client.channels.fetch(chid).catch(() => {
                console.log(`${chid} is not available!`);
            });
            if (!channel) {
                continue;
            }
            if (channel.guild.id != message.guild.id) {
                channel.send(messageData).then(msg => {}).catch(() => {});
            }
        }
    }
};

/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */
