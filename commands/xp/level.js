const { Message, Client, MessageEmbed } = require("discord.js");
var dbconfig = require("../../db.js");
var con = dbconfig.con;

module.exports = {
  name: "level",
  aliases: ["l"],
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
          .setTitle("Level")
          .setAuthor(
            target.username || target.displayName,
            target.displayAvatarURL()
          )
          .setDescription("0")
          .setFooter("0/32");
        if (!rows[0]) return message.channel.send({ embeds: [newUser] });
        let xp = rows[0].xp;
        let level = Math.floor(Math.sqrt(xp / 20));
        embed = new MessageEmbed()
          .setTitle("Level")
          .setAuthor(
            target.username || target.displayName,
            target.displayAvatarURL()
          )
          .setDescription(`${level}`)
          .setFooter(`${xp}/${20 * (level + 1) * (level + 1)}`);
        message.channel.send({ embeds: [embed] });
        //message.channel.send(xp);
      }
    );
  },
};
