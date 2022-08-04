"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const general_1 = require("../configurations/general");
const functions_1 = require("../functions");
exports.default = (botData) => __awaiter(void 0, void 0, void 0, function* () {
    const { reply, remoteJid, socket } = botData;
    if (!(yield (0, functions_1.isAdmin)(botData))) {
        return reply("🚫 Somente admins!");
    }
    const { participants } = yield socket.groupMetadata(remoteJid);
    const jids = participants.map(({ id }) => id);
    const message = jids.reduce((acc, curr) => acc + `- @${curr.split("@")[0]}\n`, "");
    yield socket.sendMessage(remoteJid, {
        text: `${general_1.general.prefixEmoji} Atenção grupo\n\n${message}`,
        mentions: jids,
    });
});
