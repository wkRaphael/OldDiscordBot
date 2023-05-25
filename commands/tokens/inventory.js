const { Message, Client, MessageEmbed } = require("discord.js");
var dbconfig = require("../../db.js");
var itemlist = require("../../settings/items.json");
var con = dbconfig.con;
module.exports = {
  name: "inventory",
  aliases: ["inv"],
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
      `SELECT * FROM inv WHERE id = '${target.id}'`,
      (err, rows) => {
        if (err) throw err;
        newUser = new MessageEmbed()
          .setTitle("Items")
          .setAuthor(
            target.username || target.displayName,
            target.displayAvatarURL()
          );
        if (rows[0]) {
          var inv = JSON.parse(rows[0].items);
          let inv2 = [...new Set(inv)];
          let items = []; //Items by id 0 = null, Red = 1, etc.
          i = 0;
          inv2.forEach(function (a) {
            i++;
            items.push(i + ": " + itemlist.items[a]);
          });
          embed = new MessageEmbed()
            .setTitle("Items")
            .setAuthor(
              target.username || target.displayName,
              target.displayAvatarURL()
            )
            .setDescription(`${items.join("\n")}`);
          message.channel.send({ embeds: [embed] });
        } else {
          embed = new MessageEmbed()
            .setTitle("Items")
            .setAuthor(
              target.username || target.displayName,
              target.displayAvatarURL()
            );
          message.channel.send({ embeds: [embed] });
          if (!rows[0]) return message.channel.send({ embeds: [newUser] });
        }
      }
    );
  },
};
