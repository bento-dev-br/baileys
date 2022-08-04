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
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const functions_1 = require("../functions");
exports.default = ({ isImage, isVideo, webMessage, reply, sendSticker, }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    if (!isImage && !isVideo) {
        return yield reply(`⚠ Por favor, envie uma imagem ou um vídeo!`);
    }
    yield reply("Aguarde... Gerando figurinha... ⌛");
    const resultPath = path_1.default.resolve(__dirname, "..", "..", "assets", "temp", (0, functions_1.getRandomName)("webp"));
    if (isImage) {
        const imagePath = yield (0, functions_1.downloadImage)(webMessage, (0, functions_1.getRandomName)());
        (0, fluent_ffmpeg_1.default)(imagePath)
            .input(imagePath)
            .on("error", (error) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(error);
            yield reply("❌ Ocorreu um erro ao gerar o seu sticker! Tente novamente mais tarde!");
            fs_1.default.unlinkSync(imagePath);
        }))
            .on("end", () => __awaiter(void 0, void 0, void 0, function* () {
            yield sendSticker(resultPath);
            fs_1.default.unlinkSync(imagePath);
            fs_1.default.unlinkSync(resultPath);
        }))
            .addOutputOptions([
            `-vcodec`,
            `libwebp`,
            `-vf`,
            `scale='min(200,iw)':min'(200,ih)':force_original_aspect_ratio=decrease,fps=15, pad=200:200:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`,
        ])
            .toFormat("webp")
            .save(resultPath);
    }
    else {
        const videoPath = yield (0, functions_1.downloadVideo)(webMessage, (0, functions_1.getRandomName)());
        const sizeSeconds = 10;
        const isOKSecondsRules = (isVideo && ((_b = (_a = webMessage === null || webMessage === void 0 ? void 0 : webMessage.message) === null || _a === void 0 ? void 0 : _a.videoMessage) === null || _b === void 0 ? void 0 : _b.seconds) <= sizeSeconds) ||
            (isVideo &&
                ((_g = (_f = (_e = (_d = (_c = webMessage === null || webMessage === void 0 ? void 0 : webMessage.message) === null || _c === void 0 ? void 0 : _c.extendedTextMessage) === null || _d === void 0 ? void 0 : _d.contextInfo) === null || _e === void 0 ? void 0 : _e.quotedMessage) === null || _f === void 0 ? void 0 : _f.videoMessage) === null || _g === void 0 ? void 0 : _g.seconds) <= sizeSeconds);
        if (!isOKSecondsRules) {
            fs_1.default.unlinkSync(videoPath);
            yield reply(`⚠ Esse vídeo tem mais de ${sizeSeconds} segundos ... Diminui ai!`);
        }
        (0, fluent_ffmpeg_1.default)(videoPath)
            .on("error", (error) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(error);
            yield reply("❌ Ocorreu um erro ao gerar o seu sticker! Tente novamente mais tarde!");
            fs_1.default.unlinkSync(videoPath);
        }))
            .on("end", () => __awaiter(void 0, void 0, void 0, function* () {
            yield sendSticker(resultPath);
            fs_1.default.unlinkSync(videoPath);
            fs_1.default.unlinkSync(resultPath);
        }))
            .addOutputOptions([
            `-vcodec`,
            `libwebp`,
            `-vf`,
            `scale='min(200,iw)':min'(200,ih)':force_original_aspect_ratio=decrease,fps=30, pad=200:200:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`,
        ])
            .toFormat("webp")
            .save(resultPath);
    }
});
