var Discord = require("discord.js");

var bot = new Discord.Client();
var auth = require("./auth.json");
var settings = require("./settings.json");

var api = {};
api.embeds = require("./api/embeds.js");

var permissions = require("./commands/permissions.js");

var fun = require("./commands/fun.js");
var general = require("./commands/general.js");

bot.on("message", (msg) => {
	if (!msg.content.startsWith("?") || msg.content.startsWith("? ")) return;
	if (msg.author.bot) return;
	var permission = permissions.permissionsOf(msg.member);
	try {
		general.cmds(msg, bot, api, permission);
		fun.cmds(msg, bot, api, permission);
	} catch (err) {
		msg.channel.sendMessage("Oops, my developer fucked up. \nContact the <@&258425031044890624> telling them to check the logs and fix the bot.");
		console.log(err.stack)
	}
});

bot.on("ready", () => {
	console.log("Bot is running!");
	bot.user.setGame("use ?help");
});

bot.login(auth.bot_token);
