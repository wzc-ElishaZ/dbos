const Discord = require("discord.js");
const config = require("../config.json");
const GuildModel = require("../models/Guild");
const log = config.bot.moderation.entryLogging;
const colors = require("../colors.json");
module.exports.run = async (bot, message, args) => {
    try {
        if(!message.guild.id == config.bot.moderation.server.id) return;
        if(!message.member.roles.cache.has(config.bot.moderation.server.moderatorRoleId)) return;
        const Target = args[0];
        const Rank = args[1];
        const guildData = await GuildModel.findOne({ id: Target })
        const GUILD = await bot.guilds.fetch(Target);
        if(Target.length < 5) return message.channel.send("Please use the command like this: `"+ guildData.prefix +"feature (serverid) (true/false)`");
        if(Rank == "true"){
            const doc = await GuildModel.findOneAndUpdate({ id: Target}, { $set: { listed: "featured" }}, { new: true })
            message.reply(`\`${GUILD.name}\` Now has Featured!`);
            const removeEmbed = new Discord.MessageEmbed()
            .setTitle('**New guild Featured**')
            .setColor(colors.gold)
            .setTimestamp()
            .addFields(
                { name: '**Admin**', value: `${message.member.user.tag}`, inline: true },
                { name: '**Server**', value: `${GUILD.name} - ${Target}`, inline: true },
                { name: '**Featured**', value: `true`, inline: true }
            )
            .setFooter('© Wezacon.com')
           return bot.channels.cache.get(log.channelLogId).send(removeEmbed);
        } else if(Rank == "false"){
            const doc = await GuildModel.findOneAndUpdate({ id: Target}, { $set: { listed: "true" }}, { new: true })
            message.reply(`\`${GUILD.name}\` Now does not have Featured!`);
            const removeEmbed = new Discord.MessageEmbed()
            .setTitle('**Guild lost Featured**')
            .setColor(colors.danger)
            .setTimestamp()
            .addFields(
                { name: '**Admin**', value: `${message.member.user.tag}`, inline: true },
                { name: '**Server**', value: `${GUILD.name} - ${Target}`, inline: true },
                { name: '**Featured**', value: `false`, inline: true }
            )
            .setFooter('© Wezacon.com')
           return bot.channels.cache.get(log.channelLogId).send(removeEmbed);
        }
        
    } catch (error) {
        const c = require("../colors.json");
        const Err_1 = new Discord.MessageEmbed()
            .setColor(c.error)
            .setTitle("**Error**")
            .setDescription("I have encountered a unexpected error: `"+ error.message +"`\nplease report this to: https://dbos.flarum.cloud or https://github.com/wezacon/dbos")
        return message.channel.send(Err_1);
    }
}

module.exports.help = {
    name: "feature",
    aliases: []
}