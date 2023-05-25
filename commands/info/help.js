const { Message, Client, MessageEmbed } = require("discord.js");
var config = require("../../settings/config.json");

module.exports = {
  name: "help",
  aliases: ["gs!help"],
  permissions: ["SEND_MESSAGES"],
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    let prefix = config.prefix;
    embed = new MessageEmbed().setTitle("Commands").addFields(
      {
        name: "Level",
        value: `${prefix}level - Shows level\n${prefix}leaderboard - Shows top 5 leveled users`,
        inline: false,
      },
      {
        name: "Info",
        value: `${prefix}ping - Shows bot ping\n${prefix}time - Shows time in Unix time\n${prefix}help - List of all commands`,
        inline: false,
      },
      {
        name: "Hubs",
        value: `${prefix}voice-lock - Locks your hub\n${prefix}voice-unlock - Unlocks your hub`,
        inline: false,
      },
      {
        name: "Tokens",
        value: `${prefix}shop - Shows buyable items\n${prefix}inventory - Lists owned items\n${prefix}buy - Buys shop items\n${prefix}equip - Equips items\n${prefix}unequip - Unequips items\n${prefix}tokens - Show token balance\n${prefix}token-claim - Claims biweekly token (weekly if boosting)`,
        inline: false,
      }
    );
    message.channel.send({ embeds: [embed] });
  },
};
