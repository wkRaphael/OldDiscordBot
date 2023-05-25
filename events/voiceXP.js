const client = require("..");
const Discord = require("discord.js");
var dbconfig = require("../db.js");
var xpbooster = require("../settings/xp.json");
var xpboost = xpbooster.xpboost;
var con = dbconfig.con;

const XPIntervals = {};

client.on("ready", () => {
  client.guilds.fetch("908967087387607101").then((guild) => {
    guild.channels.cache
      .filter((channel) => channel.type === "GUILD_VOICE")
      .each((ch) =>
        ch.members.each((user) => {
          const userId = user.id;
          let vcRole = user.guild.roles.cache.find(
            (role) => role.id == "910360670808182794"
          );
          user.roles.add(vcRole);
          if (typeof XPIntervals[userId] === "undefined") {
            XPIntervals[userId] = setInterval(() => {
              con.query(
                `SELECT * FROM xp WHERE id = '${userId}'`,
                (err, rows) => {
                  if (err) throw err;
                  let sql;
                  if (user.voice.channelId != "957199097431990302") {
                    if (rows.length < 1) {
                      sql = `INSERT INTO xp (id) VALUES ('${userId}')`;
                      con.query(sql);
                    } else {
                      let xp = rows[0].xp;
                      let e_vc = rows[0].event_vc; // event code Delete when done
                      sql = `UPDATE xp SET xp = ${Math.floor(
                        xp + 8 * xpboost
                      )} WHERE id = '${userId}'`;
                      con.query(sql);
                      con.query(
                        `UPDATE xp SET event_vc = ${
                          e_vc + 1
                        } WHERE id = '${userId}'`
                      ); // event code Delete when done
                    }
                  }
                }
              );
            }, 60e3 /* 60 seconds */);
          }
        })
      );
  });
});

client.on("voiceStateUpdate", (oldState, newState) => {
  const connected = !!newState.channel,
    userId = newState.id;
  let vcRole = oldState.guild.roles.cache.find(
    (role) => role.id == "910360670808182794"
  );
  if (connected) {
    oldState.member.roles.add(vcRole);
    // intervals don't exist yet
    if (typeof XPIntervals[userId] === "undefined") {
      XPIntervals[userId] = setInterval(() => {
        con.query(`SELECT * FROM xp WHERE id = '${userId}'`, (err, rows) => {
          if (err) throw err;
          let sql;
          if (newState.channel.id != "957199097431990302") {
            if (rows.length < 1) {
              sql = `INSERT INTO xp (id) VALUES ('${userId}')`;
              con.query(sql);
            } else {
              let xp = rows[0].xp;
              let e_vc = rows[0].event_vc; // event code Delete when done
              sql = `UPDATE xp SET xp = ${Math.floor(
                xp + 8 * xpboost
              )} WHERE id = '${userId}'`;
              con.query(sql);
              con.query(
                `UPDATE xp SET event_vc = ${e_vc + 1} WHERE id = '${userId}'`
              ); // event code Delete when done
            }
          }
        });
      }, 60e3 /* 60 seconds */);
    }
  } else {
    oldState.member.roles.remove(vcRole);
    // user left, clear the interval
    clearInterval(XPIntervals[userId]);
    // remove the interval object, so it can be created again later
    delete XPIntervals[userId];
  }
});
