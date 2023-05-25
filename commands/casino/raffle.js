const { Message, Client } = require("discord.js");

module.exports = {
  name: "start-raffle",
  aliases: ["raffle-start", "raf-start", "start-raf"],
  permissions: ["ADMINISTRATOR"],
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    function countdown() {
      timeinterval = setInterval(() => {
        i--;
        if (i == 300) {
          message.channel.send("5 minutes left");
        } else if (i == 60) {
          message.channel.send("1 minute left");
        } else if (i == 10) {
          message.channel.send("10 seconds left");
        } else if (i == 3) {
          message.channel.send("3 seconds left");
        } else if (i == 2) {
          message.channel.send("2 seconds left");
        } else if (i == 1) {
          message.channel.send("1 second left");
        } else if (i == 0) {
          clearInterval(timeinterval);
          delete timeinterval;
          message.channel.send({
            content: `<@${
              global.raffleEnt[
                Math.floor(Math.random() * global.raffleEnt.length)
              ]
            }> won the raffle`,
          });
          global.raffleEnt = [];
        }
      }, 1000);
    }

    global.raffleEnt = [];
    i = 1800;
    countdown();
    message.channel.send({ content: "Raffle started" });
  },
};
