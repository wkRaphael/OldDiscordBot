const client = require("..");
const Discord = require("discord.js");
var dbconfig = require("../db.js");
var con = dbconfig.con;

client.on("voiceStateUpdate", (oldVoiceState, newVoiceState) => {
  // Listeing to the voiceStateUpdate event
  con.query(
    `SELECT * FROM xp WHERE id = '${newVoiceState.id}'`,
    (err, rows) => {
      if (err) throw err;

      if (rows.length < 1) {
        sql = `INSERT INTO xp (id, xp, time, lvl, vc, hub, tokens) VALUES ('${
          oldVoiceState.id
        }', 0, 0, 0, ${Math.floor(Date.now() / 1000)}, '0', 0)`;
        con.query(sql);
      } else {
        let hub = rows[0].hub;
        if (newVoiceState.channel == "910437041072910356" && hub < 1) {
          // The member connected to a channel.
          newVoiceState.channel.parent
            .createChannel(`${newVoiceState.member.displayName}'s Room`, {
              type: "GUILD_VOICE",
              parent: newVoiceState.channel.parent.id,
              permissionOverwrites: [
                {
                  id: newVoiceState.id,
                  allow: ["CONNECT"],
                },
                {
                  id: newVoiceState.guild.roles.cache.find(
                    (r) => r.id == "917607575653072896"
                  ),
                  deny: ["VIEW_CHANNEL"],
                },
              ],
            })
            .then((vc) => {
              newVoiceState.setChannel(vc);
              con.query(
                `UPDATE xp SET hub = ${vc.id} WHERE id = ${newVoiceState.id}`
              );
            });
        } else if (newVoiceState.channel == "910437041072910356" && hub > 1) {
          newVoiceState.setChannel(null);
        } else {
          return;
        }
      }
    }
  );
  if (oldVoiceState.channel === null) {
    return;
  } else if (
    oldVoiceState.channel != "910437041072910356" &&
    oldVoiceState.channel.parent == "910436979366305792" &&
    oldVoiceState.channel.members.size === 0
  ) {
    // The member disconnected from a channel.
    oldVoiceState.channel.delete();
    con.query(
      `UPDATE xp SET hub = '0' WHERE hub = '${oldVoiceState.channel.id}'`
    );
  }
});
