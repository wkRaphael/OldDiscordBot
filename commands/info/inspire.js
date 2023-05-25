const { Message, Client } = require("discord.js");
const request = require("request");
const fetch = require("node-fetch");

module.exports = {
  name: "inspire",
  aliases: ["inspireme"],
  permissions: ["SEND_MESSAGES"],
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const res = await fetch("https://inspirobot.me/api?generate=true");
    const data = await res.text();
    message.channel.send({
      files: [data],
    });
  },
};
