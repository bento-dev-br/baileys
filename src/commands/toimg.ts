import fs from "fs";

import { exec } from "child_process";
import { downloadSticker, getRandomName } from "../functions";
import { IBotData } from "../interfaces/IBotData";

export default async ({
  reply,
  sendImage,
  isSticker,
  webMessage,
}: IBotData) => {
  if (!isSticker) {
    await reply("⚠ Atenção! É necessário enviar um sticker!");
  }

  const stickerPath = await downloadSticker(webMessage, getRandomName());
  const randomImageFile = getRandomName("png");

  exec(`ffmpeg -i ${stickerPath} ${randomImageFile}`, async (error: any) => {
    fs.unlinkSync(stickerPath);
    if (error) {
      console.log(error);

      return reply(`❌ Erro ao converter o sticker para imagem!`);
    }

    await sendImage(randomImageFile);

    fs.unlinkSync(randomImageFile);
  });
};
