const { Message, Client, MessageEmbed } = require("discord.js");
var dbconfig = require("../../db.js");

module.exports = {
  name: "verify",
  aliases: ["verify"],
  permissions: ["SEND_MESSAGES"],
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (message.channelId === "927137500537974804") {
      var date = new Date();
      if (!args[0]) {
        embed = new MessageEmbed()
          .setColor("RED")
          .setDescription("Invalid Format");
        message.channel.send({ embeds: [embed] }).then((msg) => {
          setTimeout(() => msg.delete(), 5000);
        });
      } else if (
        13 > parseFloat(args[0].slice(0, 2)) > 0 &&
        32 > parseFloat(args[0].slice(3, 5)) > 0 &&
        parseFloat(args[0].slice(6, 10)) < date.getFullYear() &&
        args[0].length == 10 &&
        args[0].slice(2, 3) == "-" &&
        args[0].slice(5, 6) == "-"
      ) {
        let month = args[0].slice(0, 2) - 1;
        let day = args[0].slice(3, 5);
        let year = args[0].slice(6, 10);
        let age = new Date(year, month, day);
        if ((Date.now() - age.getTime()) / 31557600000 > 13) {
          dbconfig.con.query(
            `SELECT * FROM xp WHERE id = '${message.author.id}'`,
            (err, rows) => {
              if (err) throw err;
              let uvRole = message.guild.roles.cache.find(
                (role) => role.id == "927141014689419294"
              );
              let vRole = message.guild.roles.cache.find(
                (role) => role.id == "908970391328944149"
              );
              if (!rows[0]) {
                dbconfig.con.query(
                  `INSERT INTO xp (id, age) VALUES ('${message.author.id}', '${year}-${month}-${day}')`
                );
                message.member.roles.add(vRole);
                message.member.roles.remove(uvRole);
              } else {
                dbconfig.con.query(
                  `UPDATE xp SET age = '${year}-${month}-${day}' WHERE id = '${message.author.id}'`
                );
                message.member.roles.add(vRole);
                message.member.roles.remove(uvRole);
              }
            }
          );
        } else {
          message.member.send("You are not old enough to join this server");
          message.member.kick();
        }
      } else {
        embed = new MessageEmbed()
          .setColor("RED")
          .setDescription("Invalid Format");
        message.channel.send({ embeds: [embed] }).then((msg) => {
          setTimeout(() => msg.delete(), 5000);
        });
      }
    }
  },
};
