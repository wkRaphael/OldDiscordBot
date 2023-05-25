const client = require("..");
var config = require("../settings/config.json");
var ee = require("../settings/embed.json");
var xpbooster = require("../settings/xp.json");
var dbconfig = require("../db.js");
var con = dbconfig.con;
var xpboost = xpbooster.xpboost;
const { MessageEmbed } = require("discord.js");

function generateXP() {
  let min = 10;
  let max = 30;
  return Math.floor(
    (Math.floor(Math.random() * (max - min + 1)) + min) * xpboost
  );
}

client.on("messageCreate", async (message) => {
  if (!message.guild) return;
  if (message.author.bot) return;

  let prefix = config.prefix;
  if (message.channel.partial) await message.channel.fetch();
  if (message.partial) await message.fetch();
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const cmd = args.shift().toLowerCase();

  // getting prefix when bot mention
  if (cmd.length === 0) {
    if (message.mentions.has(client.user)) {
      message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(ee.embed_color)
            .setAuthor(`Hey, You Pinged me.. 😉`)
            .setDescription(
              `My Developer is <@260541308546973697> \n\n My Name is **${client.user.username}** \n My prefix is \`${prefix}\` \n You can see my all commands by type \`${prefix}help\``
            )
            .setFooter(ee.embed_footertext, ee.embed_footericon),
        ],
      });
    }
  }
  const command =
    client.commands.get(cmd.toLowerCase()) ||
    client.commands.find((cmds) => cmds.aliases && cmds.aliases.includes(cmd));
  if (!command) {
    if (message.channel.id != "909306097905569832") {
      con.query(
        `SELECT * FROM xp WHERE id = '${message.author.id}'`,
        (err, rows) => {
          if (err) throw err;
          if (rows.length < 1) {
            let sql;
            sql = `INSERT INTO xp (id, xp, time, lvl, vc, hub, tokens) VALUES ('${
              message.author.id
            }', ${generateXP()}, ${Math.floor(
              Date.now() / 1000
            )}, 0, 0, '0', 0)`;
            con.query(sql);
          } else if (rows[0].time + 60 > Math.floor(Date.now() / 1000)) {
            return;
          } else {
            let sql;
            let xp = rows[0].xp;
            let lvl = rows[0].lvl;
            let newXP = xp + generateXP();
            let level = Math.floor(Math.sqrt(newXP / 20));
            let e_msg = rows[0].event_msg; // event code Delete when done
            sql = `UPDATE xp SET xp = ${newXP}, time = ${Math.floor(
              Date.now() / 1000
            )}, lvl = ${level} WHERE id = '${message.author.id}'`;
            con.query(sql);
            con.query(
              `UPDATE xp SET event_msg = ${e_msg + 1} WHERE id = '${
                message.author.id
              }'`
            ); // event code Delete when done
            if (
              Math.floor(level) > lvl &&
              message.channel.id != "927137500537974804"
            ) {
              const embed = new MessageEmbed()
                .setTitle("Level Up!")
                .setAuthor(message.author.username, message.author.avatarURL())
                .setDescription(`${Math.floor(level)}`);
              message.channel.send({ embeds: [embed] });
            }
          }
        }
      );
    }
  }
  if (!message.content.startsWith(prefix)) return;
  if (command && message.channel.id != "908967087941222434") {
    // checking user perms
    if (!message.member.permissions.has(command.permissions || [])) {
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription("You don't have permission to run this command"),
        ],
      });
    }
    if (message.channel.id == "927137500537974804") {
      if (command.name == "verify") {
        command.run(client, message, args, prefix, con);
      } else return;
    } else {
      command.run(client, message, args, prefix, con);
    }
  }
});
