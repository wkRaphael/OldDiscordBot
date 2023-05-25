const { Message, Client, MessageEmbed } = require("discord.js");
var dbconfig = require("../../db.js");
var con = dbconfig.con;

module.exports = {
  name: "token-claim",
  aliases: [
    "claim-token",
    "ctoken",
    "tokenc",
    "tokenclaim",
    "claimtoken",
    "claimt",
    "tclaim",
  ],
  permissions: ["SEND_MESSAGES"],
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args, con) => {
    dbconfig.con.query(
      `SELECT * FROM xp WHERE id = '${message.author.id}'`,
      (err, rows) => {
        if (err) throw err;
        if (!rows[0]) {
          dbconfig.con.query(
            `INSERT INTO xp (id, token, claim_time) VALUES ('${
              message.author.id
            }', 1, ${Math.floor(Date.now() / 1000)})`
          );
          embed = new MessageEmbed()
            .setAuthor("")
            .setDescription("Token claimed succesfully")
            .setColor("GREEN");
          message.channel.send({ embeds: [embed] });
        } else {
          let cTime = rows[0].claim_time;
          let tokens = rows[0].tokens;
          if (
            cTime < Math.floor(Date.now() / 1000) - 604800 &&
            message.member.roles.premiumSubscriberRole
          ) {
            dbconfig.con.query(
              `UPDATE xp SET tokens = '${
                tokens + 1
              }', claim_time = ${Math.floor(Date.now() / 1000)} WHERE id = '${
                message.author.id
              }'`
            );
            embed = new MessageEmbed()
              .setAuthor("")
              .setDescription("Token claimed succesfully")
              .setColor("GREEN");
            message.channel.send({ embeds: [embed] });
          } else if (
            cTime < Math.floor(Date.now() / 1000) - 1209600 &&
            !message.member.roles.premiumSubscriberRole
          ) {
            dbconfig.con.query(
              `UPDATE xp SET tokens = '${
                tokens + 1
              }', claim_time = ${Math.floor(Date.now() / 1000)} WHERE id = '${
                message.author.id
              }'`
            );
            embed = new MessageEmbed()
              .setAuthor("")
              .setDescription("Token claimed succesfully")
              .setColor("GREEN");
            message.channel.send({ embeds: [embed] });
          } else if (message.member.roles.premiumSubscriberRole) {
            let caTime = cTime - Math.floor(Date.now() / 1000) + 604800;
            let cDays = Math.floor(caTime / 86400);
            let cHours = Math.floor((caTime - cDays * 86400) / 3600);
            let cMin = Math.floor(
              (caTime - cDays * 86400 - cHours * 3600) / 60
            );
            let cSec = Math.floor(
              caTime - cDays * 86400 - cHours * 3600 - cMin * 60
            );
            if (cDays === 0) {
              if (cHours === 0) {
                if (cMin === 0) {
                  ttc = `${cSec}s`;
                } else ttc = `${cMin}m ${cSec}s`;
              } else ttc = `${cHours}h ${cMin}m ${cSec}s`;
            } else ttc = `${cDays}d ${cHours}h ${cMin}m ${cSec}s`;
            embed = new MessageEmbed()
              .setAuthor("")
              .setDescription(`You can claim again in ${ttc}`)
              .setColor("RED");
            message.channel.send({ embeds: [embed] });
          } else if (!message.member.roles.premiumSubscriberRole) {
            let caTime = cTime - Math.floor(Date.now() / 1000) + 1209600;
            let cDays = Math.floor(caTime / 86400);
            let cHours = Math.floor((caTime - cDays * 86400) / 3600);
            let cMin = Math.floor(
              (caTime - cDays * 86400 - cHours * 3600) / 60
            );
            let cSec = Math.floor(
              caTime - cDays * 86400 - cHours * 3600 - cMin * 60
            );
            if (cDays === 0) {
              if (cHours === 0) {
                if (cMin === 0) {
                  ttc = `${cSec}s`;
                } else ttc = `${cMin}m ${cSec}s`;
              } else ttc = `${cHours}h ${cMin}m ${cSec}s`;
            } else ttc = `${cDays}d ${cHours}h ${cMin}m ${cSec}s`;
            let caTime2 = cTime - Math.floor(Date.now() / 1000) + 604800;
            let cDays2 = Math.floor(caTime2 / 86400);
            let cHours2 = Math.floor((caTime2 - cDays2 * 86400) / 3600);
            let cMin2 = Math.floor(
              (caTime2 - cDays2 * 86400 - cHours2 * 3600) / 60
            );
            let cSec2 = Math.floor(
              caTime2 - cDays2 * 86400 - cHours2 * 3600 - cMin2 * 60
            );
            if (cDays2 === 0) {
              if (cHours2 === 0) {
                if (cMin2 === 0) {
                  if (cSec2 === 0) {
                    ttc2 = "now";
                  } else ttc2 = `in ${cSec2}s`;
                } else ttc2 = `in ${cMin2}m ${cSec2}s`;
              } else ttc2 = `in ${cHours2}h ${cMin2}m ${cSec2}s`;
            } else if (caTime2 < 0) {
              ttc2 = "now";
            } else ttc2 = `in ${cDays2}d ${cHours2}h ${cMin2}m ${cSec2}s`;
            embed = new MessageEmbed()
              .setAuthor("")
              .setDescription(`You can claim again in ${ttc}`)
              .setFooter(`Boost the server to claim ${ttc2}`)
              .setColor("RED");
            message.channel.send({ embeds: [embed] });
          }
        }
      }
    );
  },
};
