const { Message, Client, MessageEmbed, Interaction } = require("discord.js");

module.exports = {
  name: "fees",
  aliases: ["ah-price", "auc-price", "auction-fees", "fee"],
  permissions: ["SEND_MESSAGES"],
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    embed = new MessageEmbed()
      .setTitle("Auction House Fees")
      .setDescription(
        "over 500 ka: 10% fee (5% fee for <@&909018645185835038>)\nunder 500 ka: 50 ka fee\nunder 100 ka: no fee"
      )
      .setFooter(
        "Fees based off of winning bid\nCharacter value must be at least 100 ka"
      )
      .setColor("#39b54a");
    message.channel.send({ embeds: [embed] });
  },
};
