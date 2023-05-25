const { Message, Client } = require("discord.js");
var dbconfig = require("../../db.js");

module.exports = {
  name: "raffle",
  aliases: ["buy-raffle"],
  permissions: ["SEND_MESSAGES"],
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (Number.isInteger(parseFloat(args[0])) && parseFloat(args[0]) > 0) {
      dbconfig.con.query(
        `SELECT * FROM chips WHERE id = '${message.author.id}'`,
        (err, rows) => {
          if (err) throw err;
          if (!rows[0])
            return message.channel.send(
              `<@${message.author.id}> you do not have enough chips`
            );
          if (rows[0].chips < parseFloat(args[0]) * 50) {
            message.channel.send(
              `<@${message.author.id}> you do not have enough chips`
            );
          } else {
            let nmb = parseFloat(args[0]);
            message.channel.send(
              `<@${message.author.id}> you have added ${parseFloat(
                args[0]
              )} entries to the raffle`
            );
            for (let i = 0; ; i++) {
              if (i >= nmb) break;
              global.raffleEnt.push(message.author.id);
            }
            dbconfig.con.query(
              `UPDATE chips SET chips = '${
                rows[0].chips - parseFloat(args[0]) * 50
              }' WHERE id = '${message.author.id}'`
            );
          }
        }
      );
    } else {
      message.channel.send(
        `<@${message.author.id}> please enter a valid number`
      );
    }
  },
};
