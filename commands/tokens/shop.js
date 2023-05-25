const { Message, Client, MessageEmbed } = require("discord.js");
var dbconfig = require("../../db.js");
var con = dbconfig.con;
var config = require("../../settings/config.json");
var items = require("../../settings/items.json");

module.exports = {
  name: "shop",
  aliases: ["shop"],
  permissions: ["SEND_MESSAGES"],
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args, con) => {
    const target = message.author.id;

    let prefix = config.prefix;
    dbconfig.con.query(
      `SELECT * FROM inv WHERE id = '${target}'`,
      (err, rows) => {
        if (err) throw err;
        embed = new MessageEmbed()
          .setTitle("Shop Categories")
          .setDescription(
            `1: Basic Color Roles\n2: Special Permission Roles\n3: Gem Color Roles`
          );
        async function Boobs() {
          message = await message.channel.send({ embeds: [embed] });
          message.react("1️⃣");
          message.react("2️⃣");
          message.react("3️⃣");
          const filter = (reaction, user) => {
            //filtering the reactions from the user
            return (
              ["1️⃣", "2️⃣", "3️⃣"].includes(reaction.emoji.name) &&
              user.id === target
            );
          };
          message
            .awaitReactions({ filter, max: 1, time: 60_000, errors: ["time"] })
            .then((collected) => {
              const reaction = collected.first();
              if (reaction.emoji.name === "1️⃣") {
                var secondEmbed = new MessageEmbed()
                  .setTitle("Shop")
                  .addFields({
                    name: "Basic Color Roles",
                    value: `1: ${items.items[1]} ${items.price[1]} Token\n2: ${items.items[2]} ${items.price[2]} Token\n3: ${items.items[3]} ${items.price[3]} Token\n4: ${items.items[4]} ${items.price[4]} Token\n5: ${items.items[5]} ${items.price[5]} Token\n6: ${items.items[6]} ${items.price[6]} Token\n`,
                    inline: false,
                  })
                  .setDescription(
                    `Use **${prefix}buy itemID** to purchase an item`
                  )
                  .setFooter("Use .inv to view purchased items");
                message.edit({ embeds: [secondEmbed] });
              } else if (reaction.emoji.name === "2️⃣") {
                var secondEmbed = new MessageEmbed()
                  .setTitle("Shop")
                  .addFields({
                    name: "Permission Roles",
                    value: `7: ${items.items[7]} ${items.price[7]} Tokens\n`,
                    inline: false,
                  })
                  .setDescription(
                    `Use **${prefix}buy itemID** to purchase an item`
                  )
                  .setFooter("Use .inv to view purchased items");
                message.edit({ embeds: [secondEmbed] });
              } else if (reaction.emoji.name === "3️⃣") {
                var secondEmbed = new MessageEmbed()
                  .setTitle("Shop")
                  .addFields({
                    name: "Gem Color Roles",
                    value: `8: ${items.items[8]} ${items.price[8]} Tokens\n9: ${items.items[9]} ${items.price[9]} Tokens\n10: ${items.items[10]} ${items.price[10]} Tokens\n11: ${items.items[11]} ${items.price[11]} Tokens\n12: ${items.items[12]} ${items.price[12]} Tokens\n13: ${items.items[13]} ${items.price[13]} Tokens\n14: ${items.items[14]} ${items.price[14]} Tokens\n15: ${items.items[15]} ${items.price[15]} Tokens\n`,
                    inline: false,
                  })
                  .setDescription(
                    `Use **${prefix}buy itemID** to purchase an item`
                  );
                message.edit({ embeds: [secondEmbed] });
              }
              message.reactions.removeAll();
            });
        }
        Boobs();
      }
    );
  },
};
