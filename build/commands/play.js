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
const path_1 = __importDefault(require("path"));
const axios_1 = __importDefault(require("axios"));
const yt_search_1 = __importDefault(require("yt-search"));
const ytdl_core_1 = __importDefault(require("ytdl-core"));
const functions_1 = require("../functions");
exports.default = ({ reply, sendImage, sendAudio, args }) => __awaiter(void 0, void 0, void 0, function* () {
    yield reply("Aguarde... Pesquisando... ⌛");
    const maxLength = 100;
    if (!args || args.length > 100) {
        return yield reply(`⚠ Limite de ${maxLength} caracteres por pesquisa!`);
    }
    const result = yield (0, yt_search_1.default)(args);
    if (!result || !result.videos.length) {
        return yield reply(`⚠ Nenhuma música encontrada!`);
    }
    const video = result.videos[0];
    const response = yield axios_1.default.get(video.image, {
        responseType: "arraybuffer",
    });
    const buffer = Buffer.from(response.data, "utf-8");
    let dateText = "";
    if (video.ago) {
        dateText = `\n*Data*: ${video.ago
            .replace("ago", "atrás")
            .replace("years", "anos")
            .replace("months", "meses")}`;
    }
    yield sendImage(buffer, `Dados encontrados
  
*Título*: ${video.title}

*Descrição*: ${video.description}

*Duração*: ${video.timestamp}${dateText}
*Views*: ${video.views}

Realizando download... ⌛`);
    const tempFile = path_1.default.resolve(__dirname, "..", "..", "assets", "temp", (0, functions_1.getRandomName)("mp3"));
    (0, ytdl_core_1.default)(video.url)
        .pipe(fs_1.default.createWriteStream(tempFile))
        .on("finish", () => __awaiter(void 0, void 0, void 0, function* () {
        yield sendAudio(tempFile, true, false);
        fs_1.default.unlinkSync(tempFile);
    }));
});
