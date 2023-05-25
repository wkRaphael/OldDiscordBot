const { Message, Client, MessageEmbed } = require("discord.js");
var dbconfig = require("../../db.js");
var con = dbconfig.con;

module.exports = {
  name: "leaderboard",
  aliases: ["top"],
  permissions: ["SEND_MESSAGES"],
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args, con) => {
    dbconfig.con.query(`SELECT * FROM xp ORDER BY xp DESC`, (err, rows) => {
      if (err) throw err;
      let lvl1 = Math.floor(Math.sqrt(rows[0].xp / 20));
      let lvl2 = Math.floor(Math.sqrt(rows[1].xp / 20));
      let lvl3 = Math.floor(Math.sqrt(rows[2].xp / 20));
      let lvl4 = Math.floor(Math.sqrt(rows[3].xp / 20));
      let lvl5 = Math.floor(Math.sqrt(rows[4].xp / 20));
      let user1 = client.users.cache.find((user) => user.id === rows[0].id);
      let user2 = client.users.cache.find((user) => user.id === rows[1].id);
      let user3 = client.users.cache.find((user) => user.id === rows[2].id);
      let user4 = client.users.cache.find((user) => user.id === rows[3].id);
      let user5 = client.users.cache.find((user) => user.id === rows[4].id);
      //let user1 = client.users.fetch(rows[0].id).then(member);
      embed = new MessageEmbed()
        .setTitle("Leaderboard")
        .setDescription(
          `#1 ${user1} Level ${lvl1}\n#2 ${user2} Level ${lvl2}\n#3 ${user3} Level ${lvl3}\n#4 ${user4} Level ${lvl4}\n#5 ${user5} Level ${lvl5}`
        );
      //.setFooter(`${xp}/${8 * (level + 2) * (level + 2)}`);
      message.channel.send({ embeds: [embed] });
      //message.channel.send(xp);
    });
  },
};
