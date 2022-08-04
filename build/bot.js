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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const general_1 = require("./configurations/general");
const connection_1 = require("./connection");
const functions_1 = require("./functions");
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    const socket = yield (0, connection_1.connect)();
    socket.ev.on("messages.upsert", (message) => __awaiter(void 0, void 0, void 0, function* () {
        const [webMessage] = message.messages;
        const _a = (0, functions_1.getBotData)(socket, webMessage), { command } = _a, data = __rest(_a, ["command"]);
        yield (0, functions_1.detectLink)(Object.assign({ command }, data));
        if (!(0, functions_1.isCommand)(command))
            return;
        try {
            const action = yield (0, functions_1.getCommand)(command.replace(general_1.general.prefix, ""));
            yield action(Object.assign({ command }, data));
        }
        catch (error) {
            console.log(error);
            if (error) {
                yield data.reply(`❌ ${error.message}`);
            }
        }
    }));
    socket.ev.on("group-participants.update", (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { id, action, participants } = data;
        if (action !== "add" || !participants.length)
            return;
        const [participant] = participants;
        const json = (0, functions_1.readJSON)(path_1.default.resolve(__dirname, "..", "cache", "antifake.json"));
        const antiFake = json.find(({ group_jid }) => group_jid === id);
        if (!antiFake || !antiFake.active)
            return;
        const brazilianDDI = participant.startsWith("55");
        if (brazilianDDI)
            return;
        yield socket.sendMessage(id, {
            text: "🤖 ℹ Devido a política de anti fakes, você número fake será removido, caso isso seja um engano, entre em contato com um administrador do grupo!",
        });
        try {
            yield socket.groupParticipantsUpdate(id, [participant], "remove");
        }
        catch (error) {
            console.log(error);
        }
    }));
});
