const { Message, Client, MessageEmbed, Interaction } = require("discord.js");

module.exports = {
  name: "zt",
  aliases: ["wa"],
  permissions: ["SEND_MESSAGES"],
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    embed = new MessageEmbed()
      .setTitle("Zero Two")
      .setDescription("Darling in the FranXX")
      .setColor("#ff9c2c")
      .setImage("https://imgur.com/fqbFdYD.png");
    message.channel.send({ embeds: [embed] }).then(function (message) {
      message.react("💕");
    });
  },
};
