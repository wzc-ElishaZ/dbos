const Discord = require("discord.js");
const UserModel = require('../models/GuildUsers');
const GUserModel = require('../models/User');
const { connect } = require('mongoose');
const config = require('../config.json');
module.exports.run = async (bot, message, args) => {
    try {
        const GuildModel = require("../models/Guild");
        const guild = await GuildModel.findOne({ id: message.guild.id });
        if(guild.premium == false) return message.reply("The server needs premium to use this command!")
            if(!message.member.hasPermission("BAN_MEMBERS")) return message.reply("You are lacking the following permissions: `BAN_MEMBERS`")
            const Target = args[0];

            const Tuser = await UserModel.findOne({ id: Target, guildID: message.guild.id });
            if(!Tuser) return message.reply("This user was not found in the database...");

            const Guser = await GUserModel.findOne({ id: Target });
            // if(Guser.admin == true) return message.reply("This profile cannot be unremoved since the user is a global Administrator!");
            if(Guser.removed == true) return message.reply("This profile can't be unremoved since it was removed site wide by one of the DBOS staff members!");
            if(Target == config.bot.id) return message.channel.send("Please insert a valid user ID");
            const RXR = args.slice(1).join(' ');
            function nl2br(str){
                return str.replace(/(?:\r\n|\r|\n)/g, '<br>');
            }
            const RSX = RXR.replace(/<[^>]+>/g, '');
            const Reason = nl2br(RSX);

            if(!Target) return message.reply('Please enter in a valid user id');

            if(!Target.length > 5) return message.reply('Please enter in a valid user id');

            const req = await UserModel.findOne({ id: Target, guildID: message.guild.id })
            if(!req) return message.reply("User not found...");


            if(req.removed == null || req.removed == undefined){
                const doc = await UserModel.findOneAndUpdate({ id: Target, guildID: message.guild.id}, { $set: { removed: false, removeReason:  Reason }}, { new: true })
                message.reply(`I've succesfully unremoved: \`${doc.id}\` `);
                bot.users.cache.get(req.id).send("Your profile has been unremoved from the "+ message.guild.name +" profile listing\nProfile: " + config.siteUrl + "/s/" + message.guild.id + "/u/" + Target);
            } else {
                const doc = await UserModel.findOneAndUpdate({ id: Target, guildID: message.guild.id}, { $set: { removed: false, removeReason:  Reason }}, { new: true })
                message.reply(`I've succesfully unremoved: \`${doc.id}\` `);
                bot.users.cache.get(req.id).send("Your profile has been unremoved from the "+ message.guild.name +" profile listing\nProfile: " + config.siteUrl + "/s/" + message.guild.id + "/u/" + Target);
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
    name: "serverunremove",
    aliases: []
}