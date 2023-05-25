const { Message, Client, MessageEmbed } = require("discord.js");
var dbconfig = require("../../db.js");
var itemlist = require("../../settings/items.json");
var con = dbconfig.con;
module.exports = {
  name: "autoequip",
  aliases: ["auto-equip"],
  permissions: ["SEND_MESSAGES"],
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args, con) => {
    dbconfig.con.query(
      `SELECT * FROM settings WHERE id = '${message.author.id}'`,
      (err, rows) => {
        if (err) throw err;
        if (!rows[0]) {
          dbconfig.con.query(
            `INSERT INTO settings (id, autoequip) VALUES ('${message.author.id}', 1`
          );
          embed = new MessageEmbed()
            .setDescription("Auto-equip enabled")
            .setColor("GREEN");
          message.channel.send({ embeds: [embed] });
        } else if (rows[0].autoequip == false) {
          dbconfig.con.query(
            `UPDATE settings SET autoequip = 1 WHERE id = '${message.author.id}'`
          );
          embed = new MessageEmbed()
            .setDescription("Auto-equip enabled")
            .setColor("GREEN");
          message.channel.send({ embeds: [embed] });
        } else {
          dbconfig.con.query(
            `UPDATE settings SET autoequip = 0 WHERE id = '${message.author.id}'`
          );
          embed = new MessageEmbed()
            .setDescription("Auto-equip disabled")
            .setColor("RED");
          message.channel.send({ embeds: [embed] });
        }
      }
    );
  },
};
