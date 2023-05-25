const { Message, Client, MessageEmbed } = require("discord.js");
var dbconfig = require("../../db.js");
var con = dbconfig.con;

module.exports = {
  name: "chips",
  aliases: ["chip"],
  permissions: ["SEND_MESSAGES"],
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args, con) => {
    let target =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.author;
    dbconfig.con.query(
      `SELECT * FROM chips WHERE id = '${target.id}'`,
      (err, rows) => {
        if (err) throw err;
        newUser = new MessageEmbed()
          .setTitle("Chips")
          .setAuthor(
            target.username || target.displayName,
            target.displayAvatarURL()
          )
          .setDescription("0");
        if (!rows[0]) return message.channel.send({ embeds: [newUser] });
        let chips = rows[0].chips;
        embed = new MessageEmbed()
          .setTitle("Chips")
          .setAuthor(
            target.username || target.displayName,
            target.displayAvatarURL()
          )
          .setDescription(`${chips}`);
        message.channel.send({ embeds: [embed] });
      }
    );
  },
};
//test
