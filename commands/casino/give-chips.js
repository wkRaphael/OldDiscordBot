const { Message, Client, MessageEmbed } = require("discord.js");
var dbconfig = require("../../db.js");
var con = dbconfig.con;

module.exports = {
  name: "give-chips",
  aliases: ["gchips"],
  permissions: ["ADMINISTRATOR"],
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args, con) => {
    if (args[0] && args[1]) {
      let target = message.guild.members.cache.get(args[0]);
      if (target && Number.isInteger(parseFloat(args[1]))) {
        if (parseFloat(args[1]) > 0) {
          dbconfig.con.query(
            `SELECT * FROM chips WHERE id = '${target.id}'`,
            (err, rows) => {
              if (err) throw err;
              if (!rows[0]) {
                dbconfig.con.query(
                  `INSERT INTO chips (id, chips) VALUES ('${target.id}', '${args[1]}')`
                );
                message.channel.send({
                  content: `Gave <@${args[0]}> ${args[1]} chips`,
                });
              } else {
                let chips = rows[0].chips;
                dbconfig.con.query(
                  `UPDATE chips SET chips = '${
                    parseFloat(chips) + parseFloat(args[1])
                  }' WHERE id = '${target.id}'`
                );
                message.channel.send({
                  content: `Gave <@${args[0]}> ${args[1]} chips`,
                });
              }
            }
          );
        }
      } else {
        embed = new MessageEmbed()
          .setDescription("Usage: .give-chips *userid integer*")
          .setColor("RED");
        message.channel.send({ embeds: [embed] });
      }
    }
  },
};
