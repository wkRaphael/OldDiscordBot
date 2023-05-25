const { Message, Client, MessageEmbed } = require("discord.js");
const e = require("express");
var dbconfig = require("../../db.js");
var con = dbconfig.con;
const isUserFlip = {};
const isOtherFlip = {};

module.exports = {
  name: "coinflip",
  aliases: ["cf"],
  permissions: ["SEND_MESSAGES"],
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args, con) => {
    const mainAuthor = message.author.id;
    dbconfig.con.query(
      `SELECT * FROM chips WHERE id = '${message.author.id}'`,
      (err, rows) => {
        if (!rows[0]) {
          embed = new MessageEmbed()
            .setDescription(`You do not have enough chips`)
            .setColor("RED");
          message.channel.send({ embeds: [embed] });
        } else {
          let userTokens = rows[0].chips;

          let target =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0]);
          if (target && target == message.author) {
            embed = new MessageEmbed()
              .setDescription(`You can not coinflip with yourself`)
              .setColor("RED");
            message.channel.send({ embeds: [embed] });
          } else if (!target) {
            embed = new MessageEmbed()
              .setDescription(`Invalid user`)
              .setColor("RED");
            message.channel.send({ embeds: [embed] });
          } else if (!Number.isInteger(parseFloat(args[1]))) {
            embed = new MessageEmbed()
              .setDescription(`Invalid amount`)
              .setColor("RED");
            message.channel.send({ embeds: [embed] });
          } else if (parseFloat(args[1]) > userTokens) {
            embed = new MessageEmbed()
              .setDescription(`You do not have enough chips`)
              .setColor("RED");
            message.channel.send({ embeds: [embed] });
          } else if (parseFloat(args[1]) < 1) {
            embed = new MessageEmbed()
              .setDescription(`Invalid amount`)
              .setColor("RED");
            message.channel.send({ embeds: [embed] });
          } else if (target) {
            dbconfig.con.query(
              `SELECT * FROM chips WHERE id = '${target.id}'`,
              (err, rows) => {
                if (err) throw err;
                if (!rows[0]) {
                  embed = new MessageEmbed()
                    .setDescription(
                      `<@${target.id}> does not have enough chips`
                    )
                    .setColor("RED");
                  message.channel.send({ embeds: [embed] });
                } else {
                  if (rows[0].chips >= parseFloat(args[1])) {
                    if (
                      typeof isUserFlip[message.author.id] === "undefined" &&
                      typeof isOtherFlip[target.id] === "undefined"
                    ) {
                      isOtherFlip[target.id] = 1;
                      isUserFlip[message.author.id] = 1;
                      message.channel.send(
                        `<@${
                          target.id
                        }> would you like to flip a coin for ${parseFloat(
                          args[1]
                        )} chips (yes/no)`
                      );
                      const filter = (m) =>
                        (m.author.id == target.id &&
                          (m.content.toUpperCase() == "YES" ||
                            m.content.toUpperCase() == "NO")) ||
                        (m.author.id == mainAuthor &&
                          m.content.toUpperCase() == "CANCEL");
                      message.channel
                        .awaitMessages({
                          filter,
                          max: 1,
                          time: 30_000,
                          errors: ["time"],
                        })
                        .then((message) => {
                          message = message.first();
                          if (
                            message.content.toUpperCase() == "YES" ||
                            message.content.toUpperCase() == "Y"
                          ) {
                            message.channel
                              .send(`Flipping Coin`)
                              .then((msg) => {
                                setTimeout(() => {
                                  if (Math.round(Math.random()) == 0) {
                                    message.channel.send(
                                      `The coin landed Heads! <@${mainAuthor}> won ${
                                        parseFloat(args[1]) * 2
                                      } chips`
                                    );
                                    dbconfig.con.query(
                                      `UPDATE chips SET chips = '${
                                        userTokens + parseFloat(args[1])
                                      }' WHERE id = '${mainAuthor}'`
                                    );
                                    dbconfig.con.query(
                                      `UPDATE chips SET chips = '${
                                        rows[0].chips - parseFloat(args[1])
                                      }' WHERE id = '${target.id}'`
                                    );
                                    delete isOtherFlip[target.id];
                                    delete isUserFlip[mainAuthor];
                                  } else {
                                    message.channel.send(
                                      `The coin landed Tails! <@${
                                        message.author.id
                                      }> won ${parseFloat(args[1] * 2)} chips`
                                    );
                                    dbconfig.con.query(
                                      `UPDATE chips SET chips = '${
                                        rows[0].chips + parseFloat(args[1])
                                      }' WHERE id = '${target.id}'`
                                    );
                                    dbconfig.con.query(
                                      `UPDATE chips SET chips = '${
                                        userTokens - parseFloat(args[1])
                                      }' WHERE id = '${mainAuthor}'`
                                    );
                                    delete isOtherFlip[target.id];
                                    delete isUserFlip[mainAuthor];
                                  }
                                }, 2e3);
                              });
                          } else if (
                            message.content.toUpperCase() == "NO" ||
                            message.content.toUpperCase() == "N"
                          ) {
                            message.channel.send(
                              `<@${mainAuthor}> your coinflip was rejected by <@${message.author.id}>`
                            );
                            delete isOtherFlip[target.id];
                            delete isUserFlip[mainAuthor];
                          } else if (
                            message.content.toUpperCase() == "CANCEL"
                          ) {
                            message.channel.send(`Coinflip canceled`);
                            delete isOtherFlip[target.id];
                            delete isUserFlip[mainAuthor];
                          } else {
                            message.channel.send(`Invalid Response`);
                            delete isOtherFlip[target.id];
                            delete isUserFlip[mainAuthor];
                          }
                        })
                        .catch(() => {
                          delete isOtherFlip[target.id];
                          delete isUserFlip[mainAuthor];
                          message.channel.send(
                            `<@${target.id}> did not respond in time`
                          );
                        });
                    } else {
                      embed = new MessageEmbed()
                        .setDescription(`User already has pending coin flip`)
                        .setColor("RED");
                      message.channel.send({ embeds: [embed] });
                    }
                  } else {
                    embed = new MessageEmbed()
                      .setDescription(
                        `<@${target.id}> does not have enough chips`
                      )
                      .setColor("RED");
                    message.channel.send({ embeds: [embed] });
                  }
                }
              }
            );
          }
        }
      }
    );
  },
};
