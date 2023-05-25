const { Message, Client } = require("discord.js");

module.exports = {
  name: "time",
  aliases: ["gs!time"],
  permissions: ["SEND_MESSAGES"],
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    message.channel.send({ content: `${Math.floor(Date.now() / 1000)}` });
  },
};
