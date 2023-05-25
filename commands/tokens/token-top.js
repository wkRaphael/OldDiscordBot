const { Message, Client, MessageEmbed } = require("discord.js");
var dbconfig = require("../../db.js");
var con = dbconfig.con;

module.exports = {
  name: "token-top",
  aliases: ["ttop", "token-leaderboard"],
  permissions: ["SEND_MESSAGES"],
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args, con) => {
    dbconfig.con.query(`SELECT * FROM xp ORDER BY tokens DESC`, (err, rows) => {
      if (err) throw err;
      let lvl1 = rows[0].tokens;
      let lvl2 = rows[1].tokens;
      let lvl3 = rows[2].tokens;
      let lvl4 = rows[3].tokens;
      let lvl5 = rows[4].tokens;
      let user1 = client.users.cache.find((user) => user.id === rows[0].id);
      let user2 = client.users.cache.find((user) => user.id === rows[1].id);
      let user3 = client.users.cache.find((user) => user.id === rows[2].id);
      let user4 = client.users.cache.find((user) => user.id === rows[3].id);
      let user5 = client.users.cache.find((user) => user.id === rows[4].id);
      //let user1 = client.users.fetch(rows[0].id).then(member);
      embed = new MessageEmbed()
        .setTitle("Leaderboard")
        .setDescription(
          `#1 ${user1} ${lvl1} Tokens\n#2 ${user2} ${lvl2} Tokens\n#3 ${user3} ${lvl3} Tokens\n#4 ${user4} ${lvl4} Tokens\n#5 ${user5} ${lvl5} Tokens`
        );
      //.setFooter(`${xp}/${8 * (level + 2) * (level + 2)}`);
      message.channel.send({ embeds: [embed] });
      //message.channel.send(xp);
    });
  },
};
