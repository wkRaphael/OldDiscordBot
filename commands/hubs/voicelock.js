const { Message, Client } = require("discord.js");
var dbconfig = require("../../db.js");
var con = dbconfig.con;

module.exports = {
  name: "voice-lock",
  aliases: ["vc-lock"],
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
        if (hub !== 0) {
          const voiceChannel = message.guild.channels.resolve(hub);
          if (voiceChannel) {
            voiceChannel.permissionOverwrites.edit(
              message.channel.guild.roles.everyone,
              { CONNECT: false }
            );
          } else message.channel.send({ content: "You do not own a hub" });
        }
      }
    );
  },
};
