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
const fs_1 = __importDefault(require("fs"));
const child_process_1 = require("child_process");
const functions_1 = require("../functions");
exports.default = ({ reply, sendImage, isSticker, webMessage, }) => __awaiter(void 0, void 0, void 0, function* () {
    if (!isSticker) {
        yield reply("⚠ Atenção! É necessário enviar um sticker!");
    }
    const stickerPath = yield (0, functions_1.downloadSticker)(webMessage, (0, functions_1.getRandomName)());
    const randomImageFile = (0, functions_1.getRandomName)("png");
    (0, child_process_1.exec)(`ffmpeg -i ${stickerPath} ${randomImageFile}`, (error) => __awaiter(void 0, void 0, void 0, function* () {
        fs_1.default.unlinkSync(stickerPath);
        if (error) {
            console.log(error);
            return reply(`❌ Erro ao converter o sticker para imagem!`);
        }
        yield sendImage(randomImageFile);
        fs_1.default.unlinkSync(randomImageFile);
    }));
});
