import genshindb, { Language } from "genshin-db";
import { setKey } from "../utils/consts/Artifact";
import fs from "fs";

type ArtifactData = {
  name: { en: string; ja: string };
};
type ArtifactDB = {
  flower?: ArtifactData;
  plume?: ArtifactData;
  sands?: ArtifactData;
  goblet?: ArtifactData;
  circlet: ArtifactData;
};
type extractArtifactSetOut = {
  [key: string]: ArtifactDB;
};
const extractArtifactSet = () => {
  let dbs: extractArtifactSetOut = {};
  setKey.map((key) => {
    let setEn = genshindb.artifacts(key)!;
    let setJa = genshindb.artifacts(key, {
      resultLanguage: Language.Japanese,
    })!;
    let db: ArtifactDB = {
      flower: setEn.flower
        ? { name: { en: setEn.flower.name, ja: setJa.flower!.name } }
        : undefined,
      plume: setEn.plume
        ? { name: { en: setEn.plume.name, ja: setJa.plume!.name } }
        : undefined,
      sands: setEn.sands
        ? { name: { en: setEn.sands.name, ja: setJa.sands!.name } }
        : undefined,
      goblet: setEn.goblet
        ? { name: { en: setEn.goblet.name, ja: setJa.goblet!.name } }
        : undefined,
      circlet: { name: { en: setEn.circlet.name, ja: setJa.circlet.name } },
    };
    dbs[key] = db;
  });
  //console.log(dbs);
  fs.writeFileSync(
    "./genshindb-partial.json",
    JSON.stringify(dbs, null, 2),
    "utf-8"
  );
};
extractArtifactSet();
