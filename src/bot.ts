import path from "path";
import { general } from "./configurations/general";
import { connect } from "./connection";
import {
  detectLink,
  getBotData,
  getCommand,
  isCommand,
  readJSON,
} from "./functions";
import { IAntiFake } from "./interfaces/IAntiFake";

export default async () => {
  const socket = await connect();

  socket.ev.on("messages.upsert", async (message) => {
    const [webMessage] = message.messages;
    const { command, ...data } = getBotData(socket, webMessage);

    await detectLink({ command, ...data });

    if (!isCommand(command)) return;

    try {
      const action = await getCommand(command.replace(general.prefix, ""));
      await action({ command, ...data });
    } catch (error) {
      console.log(error);
      if (error) {
        await data.reply(`❌ ${error.message}`);
      }
    }
  });

  socket.ev.on("group-participants.update", async (data) => {
    const { id, action, participants } = data;

    if (action !== "add" || !participants.length) return;

    const [participant] = participants;

    const json = readJSON(
      path.resolve(__dirname, "..", "cache", "antifake.json")
    ) as IAntiFake[];

    const antiFake = json.find(({ group_jid }) => group_jid === id);

    if (!antiFake || !antiFake.active) return;

    const brazilianDDI = participant.startsWith("55");

    if (brazilianDDI) return;

    await socket.sendMessage(id, {
      text: "🤖 ℹ Devido a política de anti fakes, você número fake será removido, caso isso seja um engano, entre em contato com um administrador do grupo!",
    });

    try {
      await socket.groupParticipantsUpdate(id, [participant], "remove");
    } catch (error) {
      console.log(error);
    }
  });
};
