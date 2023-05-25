const { Message, Client, MessageEmbed } = require("discord.js");
var dbconfig = require("../../db.js");

module.exports = {
  name: "run",
  aliases: ["verrunify"],
  permissions: ["ADMINISTRATOR"],
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    let role = message.guild.roles.cache.find(
      (r) => r.id === "927461634396549130"
    );
    message.guild.members.cache.each((m) => m.roles.add(role));
  },
};
