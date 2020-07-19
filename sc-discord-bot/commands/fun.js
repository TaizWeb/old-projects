module.exports = {
	cmds: (msg, bot, api, perms) => {
		const Discord = require("discord.js");
		let parameters = msg.content.split(" ");
		let author = msg.author;
		if (msg.content.toLowerCase().startsWith("?uwu")) {
			if (perms !== "admin") {
				let error = api.embeds.newEmbed("", [{"name": "ERROR", "desc": "You don't have permission to use '?uwu'."}], bot.user, "#ef0000");
				return msg.channel.sendEmbed(error);
			} else {
				if (parameters[1] != undefined) {
					let uwuMessage = "";
					for (let i = 0; i < parseInt(parameters[1]); i++) {
						uwuMessage += "uwu ";
					}
					msg.channel.sendMessage(uwuMessage);
				} else {
					msg.channel.sendMessage("uwu");
				}
			}
		} else if (msg.content.toLowerCase().startsWith("?hnng")) {
			if (parameters[1] != undefined) {
				let hnngMessage = "h";
				for (let i = 0; i < parseInt(parameters[1]); i++) {
					hnngMessage += "n";
				}
				hnngMessage += "g";
				return msg.channel.sendMessage(hnngMessage);
			} else {
				return msg.channel.sendMessage("hnng");
			}
		}
	}
}