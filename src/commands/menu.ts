import path from "path";

import { menu } from "../configurations/menu";
import { IBotData } from "../interfaces/IBotData";

export default async ({ sendImage }: IBotData) => {
  await sendImage(
    path.resolve(__dirname, "..", "..", "assets", "images", "menu.jpg"),
    menu
  );
};
