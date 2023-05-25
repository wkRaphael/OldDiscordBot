const { Message, Client, MessageEmbed } = require("discord.js");
var dbconfig = require("../../db.js");
var con = dbconfig.con;

module.exports = {
  name: "give-tokens",
  aliases: ["gtokens"],
  permissions: ["ADMINISTRATOR"],
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args, con) => {
    let target = message.mentions.members.first();
    if (target && Number.isInteger(parseFloat(args[1]))) {
      dbconfig.con.query(
        `SELECT * FROM xp WHERE id = '${target.id}'`,
        (err, rows) => {
          if (err) throw err;
          if (!rows[0]) {
            dbconfig.con.query(
              `INSERT INTO xp (id, token) VALUES ('${target.id}', '${args[1]}')`
            );
            if (parseFloat(args[1]) == 1) {
              embed = new MessageEmbed().setDescription(
                `Gave ${args[1]} token to ${target.user}`
              );
              message.channel.send({ embeds: [embed] });
            } else if (parseFloat(args[1]) == -1) {
              embed = new MessageEmbed().setDescription(
                `Removed ${Math.abs(parseFloat(args[1]))} token from ${
                  target.user
                }`
              );
              message.channel.send({ embeds: [embed] });
            } else if (parseFloat(args[1]) < -1) {
              embed = new MessageEmbed().setDescription(
                `Removed ${Math.abs(parseFloat(args[1]))} tokens from ${
                  target.user
                }`
              );
              message.channel.send({ embeds: [embed] });
            } else {
              embed = new MessageEmbed().setDescription(
                `Gave ${args[1]} tokens to ${target.user}`
              );
              message.channel.send({ embeds: [embed] });
            }
          } else {
            let tokens = rows[0].tokens;
            dbconfig.con.query(
              `UPDATE xp SET tokens = '${
                parseFloat(tokens) + parseFloat(args[1])
              }' WHERE id = '${target.id}'`
            );
            if (parseFloat(args[1]) == 1) {
              embed = new MessageEmbed().setDescription(
                `Gave ${args[1]} token to ${target.user}`
              );
              message.channel.send({ embeds: [embed] });
            } else if (parseFloat(args[1]) == -1) {
              embed = new MessageEmbed().setDescription(
                `Removed ${Math.abs(parseFloat(args[1]))} token from ${
                  target.user
                }`
              );
              message.channel.send({ embeds: [embed] });
            } else if (parseFloat(args[1]) < -1) {
              embed = new MessageEmbed().setDescription(
                `Removed ${Math.abs(parseFloat(args[1]))} tokens from ${
                  target.user
                }`
              );
              message.channel.send({ embeds: [embed] });
            } else {
              embed = new MessageEmbed().setDescription(
                `Gave ${args[1]} tokens to ${target.user}`
              );
              message.channel.send({ embeds: [embed] });
            }
          }
        }
      );
    } else {
      embed = new MessageEmbed()
        .setDescription("Usage: .give-tokens <@564992899016818688> *integer*")
        .setColor("RED");
      message.channel.send({ embeds: [embed] });
    }
  },
};
