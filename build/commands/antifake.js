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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const general_1 = require("../configurations/general");
const functions_1 = require("../functions");
exports.default = (botData) => __awaiter(void 0, void 0, void 0, function* () {
    const { reply, remoteJid, args } = botData;
    if (!(yield (0, functions_1.isAdmin)(botData))) {
        return reply("🚫 Somente admins!");
    }
    if (!args || !["on", "off"].includes(args.trim())) {
        return reply(`🚫 Use: ${general_1.general.prefix}antifake on/off`);
    }
    const active = args.trim() === "on";
    const json = (0, functions_1.readJSON)(path_1.default.resolve(__dirname, "..", "..", "cache", "antifake.json"));
    const antiFake = json.find(({ group_jid }) => group_jid === remoteJid);
    if (antiFake) {
        antiFake.active = active;
    }
    else {
        json.push({
            group_jid: remoteJid,
            active,
        });
    }
    (0, functions_1.writeJSON)(path_1.default.resolve(__dirname, "..", "..", "cache", "antilink.json"), json);
    yield reply(`✅ Antifake ${active ? "ativado" : "desativado"} com sucesso!`);
});
