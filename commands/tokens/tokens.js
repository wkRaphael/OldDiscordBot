const { Message, Client, MessageEmbed } = require("discord.js");
var dbconfig = require("../../db.js");
var con = dbconfig.con;

module.exports = {
  name: "tokens",
  aliases: ["token"],
  permissions: ["SEND_MESSAGES"],
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args, con) => {
    let target = message.mentions.members.first() || message.author;
    dbconfig.con.query(
      `SELECT * FROM xp WHERE id = '${target.id}'`,
      (err, rows) => {
        if (err) throw err;
        newUser = new MessageEmbed()
          .setTitle("Tokens")
          .setAuthor(
            target.username || target.displayName,
            target.displayAvatarURL()
          )
          .setDescription("0");
        if (!rows[0]) return message.channel.send({ embeds: [newUser] });
        let tokens = rows[0].tokens;
        embed = new MessageEmbed()
          .setTitle("Tokens")
          .setAuthor(
            target.username || target.displayName,
            target.displayAvatarURL()
          )
          .setDescription(`${tokens}`);
        message.channel.send({ embeds: [embed] });
      }
    );
  },
};
