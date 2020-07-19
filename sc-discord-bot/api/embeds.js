module.exports = {
	newEmbed: (title, fields=[], author, color="#2E3136") => {
		const Discord = require('discord.js');
		let response = new Discord.RichEmbed();
		if (author) response.setAuthor(author.username, author.avatarURL);
		response.setColor(color);
		if (title) response.setTitle(title);
		fields.forEach((element) => {
			if (element.inline) response.addField(element.name, element.desc, true);
			else response.addField(element.name, element.desc);
		});
		return response;
	}
}