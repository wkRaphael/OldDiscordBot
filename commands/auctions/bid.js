const { Message, Client } = require("discord.js");

i = 0;

module.exports = {
  name: "bid",
  aliases: ["bid"],
  permissions: ["SEND_MESSAGES"],
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    function countdown() {
      timeinterval = setInterval(() => {
        i++;
        if (i == 20) {
          message.channel.send("10 seconds left");
        } else if (i == 28) {
          message.channel.send("3 seconds left");
        } else if (i == 29) {
          message.channel.send("2 seconds left");
        } else if (i == 30) {
          message.channel.send("1 second left");
        } else if (i == 31) {
          clearInterval(timeinterval);
          delete timeinterval;
          message.channel.send({
            content: `<@${global.auctionPrice[1]}> won the auction with ${global.auctionPrice[0]} ka`,
          });
          global.auctionPrice = null;
        }
      }, 1000);
    }
    if (Number.isInteger(parseFloat(args[0]))) {
      if (global.auctionPrice) {
        if (global.auctionPrice[0] == 0) countdown();
        if (global.auctionPrice[0] >= 1000) {
          if (global.auctionPrice[0] + 100 <= parseFloat(args[0])) {
            i = 0;
            global.auctionPrice = [parseFloat(args[0]), `${message.author.id}`];
            message.channel.send({
              content: `You bid ${global.auctionPrice[0]} ka`,
            });
          } else {
            message.channel.send({
              content: `Your bid must be atleast ${
                global.auctionPrice[0] + 100
              } ka`,
            });
          }
        } else if (global.auctionPrice[0] >= 500) {
          if (global.auctionPrice[0] + 10 <= parseFloat(args[0])) {
            i = 0;
            global.auctionPrice = [parseFloat(args[0]), `${message.author.id}`];
            message.channel.send({
              content: `You bid ${global.auctionPrice[0]} ka`,
            });
          } else {
            message.channel.send({
              content: `Your bid must be atleast ${
                global.auctionPrice[0] + 10
              } ka`,
            });
          }
        } else if (global.auctionPrice[0] >= 100) {
          if (global.auctionPrice[0] + 5 <= parseFloat(args[0])) {
            i = 0;
            global.auctionPrice = [parseFloat(args[0]), `${message.author.id}`];
            message.channel.send({
              content: `You bid ${global.auctionPrice[0]} ka`,
            });
          } else {
            message.channel.send({
              content: `Your bid must be atleast ${
                global.auctionPrice[0] + 5
              } ka`,
            });
          }
        } else {
          if (global.auctionPrice[0] < parseFloat(args[0])) {
            i = 0;
            global.auctionPrice = [parseFloat(args[0]), `${message.author.id}`];
            message.channel.send({
              content: `You bid ${global.auctionPrice[0]} ka`,
            });
          } else {
            message.channel.send({
              content: `Your bid must be atleast ${
                global.auctionPrice[0] + 1
              } ka`,
            });
          }
        }
      }
    }
  },
};
