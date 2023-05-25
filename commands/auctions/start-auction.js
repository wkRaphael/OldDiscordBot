const { Message, Client } = require("discord.js");

module.exports = {
  name: "start-auction",
  aliases: ["auction-start", "auc-start", "start-auc"],
  permissions: ["ADMINISTRATOR"],
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    global.auctionPrice = [0, "Nobody"];
    message.channel.send({ content: "Auction started" });
  },
};
