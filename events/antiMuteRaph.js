const client = require("..");

client.on("voiceStateUpdate", (oldVoiceState, newVoiceState) => {
  if (
    newVoiceState.id == "260541308546973697" &&
    newVoiceState.serverMute == true
  ) {
    newVoiceState.setMute(false);
  }
  if (
    newVoiceState.id == "260541308546973697" &&
    newVoiceState.serverDeaf == true
  ) {
    newVoiceState.setDeaf(false);
  }
});
