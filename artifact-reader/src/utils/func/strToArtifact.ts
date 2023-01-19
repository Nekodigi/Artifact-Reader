import {
  setKey,
  setKeyType,
  slotKey,
  slotKeyType,
} from "../consts/Artifact";
import { similarity } from "./string";
import genshindb, { Language } from "genshin-db";
import { substatKey } from "../consts/Substat";
import { statDef, statKey, statKeyType } from "../consts/Stat";

export type str2artifactSetOut = {
  key: setKeyType;
  part: slotKeyType;
  confidence: number;
};
export const str2artifactSet = (
  str: string,
  lang: Language
): str2artifactSetOut => {
  let maxSim = 0;
  let key_: setKeyType = "Adventurer";
  let part_: slotKeyType = "circlet";

  setKey.forEach((key) => {
    let a = genshindb.artifacts(key, {
      resultLanguage: lang,
    })!;
    slotKey.forEach((part) => {
      if (a[part]) {
        let sim = similarity(str, a[part]!.name);
        if (sim > maxSim) {
          key_ = key;
          part_ = part;
          maxSim = sim;
        }
      }
    });
  });
  return { key: key_, part: part_, confidence: maxSim };
};

export type str2statOut = {
  key: statKeyType;
  value: number;
  confidence: number;
};

export const str2stats = (str: string, lang: Language): str2statOut[] => {
  var strs = str.split("\n");
  strs = strs.filter((str_) => str_ !== "");
  var targets = [];
  for (let i = 0; i < strs.length; i++) {
    let str_ = strs[i];
    if (
      str_.replace(/\s/g, "").includes("Set") ||
      str_.replace(/\s/g, "").includes("セット")
    ) {
      break;
    }
    targets.push(str_);
  }

  return targets.map((str) => str2stat(str, lang));
};

export const str2stat = (str: string, lang: Language): str2statOut => {
  let l: "en" | "ja" = lang === Language.English ? "en" : "ja";

  let datas = str.split("+"); //plus could be lost
  if (datas.length === 1) {
    console.log("+ error");
    //could be plus detection ERROR
    for (let i = 0; i < datas[0].length; i++) {
      if ("⓪①②③④⑤⑥⑦⑧⑨0123456789".includes(datas[0][i])) {
        datas[1] = datas[0].substring(i);
        datas[0] = datas[0].substring(0, i);
        console.log(`split at ${i} ${datas[0]} ${datas[1]}`);
        break;
      }
    }
  }

  let key_ = datas[0] + (str.includes("%") ? "%" : "");
  var value_ = str.includes("%") ? datas[1].split("%")[0] : datas[1]; //10% => 10
  let maxSim = 0;
  let key: statKeyType = "ERR";

  const replaceList = [
    ["⓪", "0"],
    ["①", "1"],
    ["②", "2"],
    ["③", "3"],
    ["④", "4"],
    ["⑤", "5"],
    ["⑥", "6"],
    ["⑦", "7"],
    ["⑧", "8"],
    ["⑨", "9"],
  ];
  key_ = key_.replaceAll(" ", "").replaceAll("カ", "力");
  replaceList.forEach((replaceItem) => {
    value_ = value_.replaceAll(replaceItem[0], replaceItem[1]);
  });
  
  if (l === "en") {
    statKey.forEach((key_i) => {
      let sim = similarity(statDef[key_i as statKeyType].name[l], key_);
      if (sim > maxSim) {
        key = key_i as statKeyType;
        maxSim = sim;
      }
    });
  } else {
    console.log(str, "JP");
    str = str.replace(/\s/g, "");
    //some letter could be lost.
    //use nearest!
    statKey.forEach((key_i) => {
      let sim = similarity(statDef[key_i as statKeyType].name[l], key_);
      if (sim > maxSim) {
        key = key_i as statKeyType;
        maxSim = sim;
      }
    });
  }
  let value = Number(value_);

  console.log(key_, value_, value, key);

  statKey.forEach((key_) => {
    let sim = similarity(statDef[key_ as statKeyType].name[l], str);
    if (sim > maxSim) {
      key = key_ as statKeyType;
      maxSim = sim;
    }
  });
  return { key, value, confidence: maxSim };
};
