const { Message, Client } = require("discord.js");
var dbconfig = require("../../db.js");
var con = dbconfig.con;

module.exports = {
  name: "whitelist",
  aliases: ["voice-whitelist"],
  permissions: ["SEND_MESSAGES"],
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    dbconfig.con.query(
      `SELECT * FROM xp WHERE id = '${message.author.id}'`,
      (err, rows) => {
        if (err) throw err;
        let hub = rows[0].hub;
        let target = message.mentions.members.first();
        if (hub === 0) {
          message.channel.send({ content: "You do not own a hub" });
        } else if (target && hub !== 0) {
          const voiceChannel = message.guild.channels.resolve(hub);
          voiceChannel.edit({
            permissionOverwrites: [{ id: target.id, CONNECT: true }],
          });
        } else return;
      }
    );
  },
};
