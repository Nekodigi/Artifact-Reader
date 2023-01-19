import genshindb from "genshin-db";
import { setKey } from "../utils/consts/Artifact";
import { setKeyType } from "../utils/consts/Artifact";

type ArtifactData = {
  name: string;
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
  let dbs = setKey.map((key: setKeyType) => {
    let set = genshindb.artifacts(key)!;
    let db: ArtifactDB = {
      flower: set.flower,
      plume: set.plume,
      sands: set.sands,
      goblet: set.goblet,
      circlet: set.circlet,
    };
    return db;
  });
  //console.log("FIN");
  //console.log(dbs);
};
extractArtifactSet();

