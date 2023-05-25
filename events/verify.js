const client = require("..");

client.on("messageCreate", async (message) => {
  if (
    message.channelId === "927137500537974804" &&
    message.member.id != "564992899016818688"
  ) {
    message.delete();
  }
});
