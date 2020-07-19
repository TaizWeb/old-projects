module.exports = {
	cmds: (msg, bot, api, perms) => {
		const Discord = require("discord.js");
		let author = msg.author;
		if (msg.content.toLowerCase().startsWith("?ping")) {
			return msg.channel.sendEmbed(api.embeds.newEmbed("", [{"name": "Ping", "desc": "Pong! "+bot.ping+"ms"}], bot.user));
		} else if (msg.content.toLowerCase().startsWith("?help")) {
			return msg.channel.sendEmbed(api.embeds.newEmbed("Help", [
				{"name": "Ping", "desc": "Gives you the latest ping to Discords servers from the bot."},
				{"name": "Help", "desc": "What you are reading."},
				{"name": "UwU [ammount]", "desc": "UwU."},
				{"name": "Hnng ['n's]", "desc": "Hnnnnnnnnng."}
			], bot.user));
		} else if (msg.content.toLowerCase().startsWith("?myperms")) {
			return msg.channel.sendEmbed(api.embeds.newEmbed("", [{"name": "Your Permissions", "desc": perms}], bot.user));
		}
	}
}