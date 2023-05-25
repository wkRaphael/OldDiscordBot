const { Message, Client, MessageEmbed } = require("discord.js");
var dbconfig = require("../../db.js");
var con = dbconfig.con;
var itemlist = require("../../settings/items.json");

function Numeric_sort(ar) {
  var i = 0,
    j;
  while (i < ar.length) {
    j = i + 1;
    while (j < ar.length) {
      if (ar[j] < ar[i]) {
        var temp = ar[i];
        ar[i] = ar[j];
        ar[j] = temp;
      }
      j++;
    }
    i++;
  }
}

module.exports = {
  name: "buy",
  aliases: ["purchase"],
  permissions: ["SEND_MESSAGES"],
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args, con) => {
    let items = [];
    dbconfig.con.query(
      `SELECT * FROM xp WHERE id = '${message.author.id}'`,
      (err, rows) => {
        if (!rows[0]) {
          let failMsg = new MessageEmbed()
            .setAuthor("")
            .setDescription(
              "You do not have enough tokens to purchase this item"
            )
            .setColor("RED");
          message.channel.send({ embeds: [failMsg] });
          dbconfig.con.query(
            `INSERT INTO xp (id) VALUES ('${message.author.id}')`
          );
          dbconfig.con.query(
            `INSERT INTO inv (id) VALUES ('${message.author.id}')`
          );
        } else {
          if (
            Number.isInteger(parseFloat(args[0])) &&
            args[0] > 0 &&
            parseFloat(args[0]) < itemlist.items.length
          ) {
            let tokens = rows[0].tokens;
            if (tokens >= itemlist.price[args[0]]) {
              dbconfig.con.query(
                `SELECT * FROM inv WHERE id = '${message.author.id}'`,
                (err, rows) => {
                  if (!rows[0]) {
                    dbconfig.con.query(
                      `INSERT INTO inv (id) VALUES ('${message.author.id}')`
                    );
                    inv.push(parseFloat(args[0]));
                    Numeric_sort(inv);
                    let buyMsg = new MessageEmbed()
                      .setAuthor("")
                      .setDescription(
                        `You have successfully purchased ${
                          itemlist.items[args[0]]
                        }\nUse **.equip ${
                          inv.indexOf(parseFloat(args[0])) + 1
                        }** to equip your new item`
                      )
                      .setColor("GREEN");
                    dbconfig.con.query(
                      `UPDATE inv SET items = '${JSON.stringify(
                        inv
                      )}' WHERE id = '${message.author.id}'`
                    );
                    dbconfig.con.query(
                      `UPDATE xp SET tokens = '${
                        tokens - itemlist.price[args[0]]
                      }' WHERE id = '${message.author.id}'`
                    );
                    message.channel.send({ embeds: [buyMsg] });
                  } else {
                    var inv = JSON.parse(rows[0].items);
                    if (!inv.includes(parseFloat(args[0]))) {
                      if (itemlist.items[args[0]].toString().includes("<@&")) {
                        dbconfig.con.query(
                          `SELECT * FROM settings WHERE id = '${message.author.id}'`,
                          (err, rows) => {
                            if (err) throw err;
                            if (!rows[0] || rows[0].autoequip == false) {
                              let buyMsg = new MessageEmbed()
                                .setAuthor("")
                                .setDescription(
                                  `You have successfully purchased ${
                                    itemlist.items[args[0]]
                                  }\nUse **.equip ${
                                    inv.indexOf(parseFloat(args[0])) + 1
                                  }** to equip your new item`
                                )
                                .setColor("GREEN");
                              message.channel.send({ embeds: [buyMsg] });
                            } else {
                              let role = message.guild.roles.cache.find(
                                (r) =>
                                  r.id ==
                                  itemlist.items[parseFloat(args[0])].substr(
                                    3,
                                    18
                                  )
                              );
                              message.member.roles.add(role);
                              let buyMsg = new MessageEmbed()
                                .setAuthor("")
                                .setDescription(
                                  `You have successfully purchased ${
                                    itemlist.items[args[0]]
                                  }\nItem auto-equipped`
                                )
                                .setColor("GREEN");
                              message.channel.send({ embeds: [buyMsg] });
                            }
                          }
                        );
                        inv.push(parseFloat(args[0]));
                        Numeric_sort(inv);
                        dbconfig.con.query(
                          `UPDATE inv SET items = '${JSON.stringify(
                            inv
                          )}' WHERE id = '${message.author.id}'`
                        );
                        dbconfig.con.query(
                          `UPDATE xp SET tokens = '${
                            tokens - itemlist.price[args[0]]
                          }' WHERE id = '${message.author.id}'`
                        );
                      }
                    } else {
                      let buyMsg = new MessageEmbed()
                        .setAuthor("")
                        .setDescription(
                          `You already own ${itemlist.items[args[0]]}`
                        )
                        .setColor("RED");
                      message.channel.send({ embeds: [buyMsg] });
                    }
                  }
                }
              );
            } else {
              dbconfig.con.query(
                `SELECT * FROM inv WHERE id = '${message.author.id}'`,
                (err, rows) => {
                  if (!rows[0]) {
                    dbconfig.con.query(
                      `INSERT INTO inv (id) VALUES ('${message.author.id}')`
                    );
                    let failMsg = new MessageEmbed()
                      .setAuthor("")
                      .setDescription(
                        "You do not have enough tokens to purchase this item"
                      )
                      .setColor("RED");
                    message.channel.send({ embeds: [failMsg] });
                  } else if (
                    JSON.parse(rows[0].items).includes(parseFloat(args[0]))
                  ) {
                    let failMsg = new MessageEmbed()
                      .setAuthor("")
                      .setDescription(
                        `You already own ${itemlist.items[args[0]]}`
                      )
                      .setColor("RED");
                    message.channel.send({ embeds: [failMsg] });
                  } else {
                    let failMsg = new MessageEmbed()
                      .setAuthor("")
                      .setDescription(
                        "You do not have enough tokens to purchase this item"
                      )
                      .setColor("RED");
                    message.channel.send({ embeds: [failMsg] });
                  }
                }
              );
            }
          } else {
            let failMsg = new MessageEmbed()
              .setAuthor("")
              .setDescription("Please enter a valid id")
              .setColor("RED");
            message.channel.send({ embeds: [failMsg] });
          }
        }
      }
    );
  },
};
