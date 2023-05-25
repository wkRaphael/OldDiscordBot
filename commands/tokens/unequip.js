const { Message, Client, MessageEmbed } = require("discord.js");
var dbconfig = require("../../db.js");
var itemlist = require("../../settings/items.json");
var con = dbconfig.con;
module.exports = {
  name: "unequip",
  aliases: ["unequip"],
  permissions: ["SEND_MESSAGES"],
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args, con) => {
    dbconfig.con.query(
      `SELECT * FROM inv WHERE id = '${message.author.id}'`,
      (err, rows) => {
        if (err) throw err;
        if (rows[0]) {
          var inv = JSON.parse(rows[0].items);
          let inv2 = [...new Set(inv)];
          let items = [];
          //Items by id 0 = null, Red = 1, etc.
          i = 0;
          inv2.forEach(function (a) {
            i++;
            items.push(itemlist.items[a]);
          });
          if (
            Number.isInteger(parseFloat(args[0])) &&
            args[0] > 0 &&
            args[0] < i + 1
          ) {
            if (items[parseFloat(args[0]) - 1].toString().includes("<@&")) {
              let role = message.guild.roles.cache.find(
                (r) => r.id == items[parseFloat(args[0]) - 1].substr(3, 18)
              );
              if (items[parseFloat(args[0]) - 1].toString().includes("<@&")) {
                message.member.roles.remove(role);
                embed = new MessageEmbed()
                  .setAuthor("")
                  .setDescription(
                    `${items[parseFloat(args[0]) - 1]} unequipped`
                  )
                  .setColor("GREEN");
                message.channel.send({ embeds: [embed] });
              } else {
                embed = new MessageEmbed()
                  .setAuthor("")
                  .setDescription(
                    `You do not have ${items[parseFloat(args[0]) - 1]} equipped`
                  )
                  .setColor("RED");
                message.channel.send({ embeds: [embed] });
              }
            }
          } else {
            embed = new MessageEmbed()
              .setAuthor("")
              .setDescription("Invalid ID")
              .setColor("RED");
            message.channel.send({ embeds: [embed] });
          }
        } else {
          embed = new MessageEmbed()
            .setAuthor("")
            .setDescription(`You do not have anything equipped`)
            .setColor("RED");
          message.channel.send({ embeds: [embed] });
        }
      }
    );
  },
};
