import cv, { MinMaxLoc, Rect } from "@techstark/opencv-js";
import Tesseract from "tesseract.js";
import { setKeyType, slotKeyType } from "../consts/Artifact";
import { statKeyType } from "../consts/Stat";
import { ArtifactType } from "../types/Artifact";
import { Language } from "../types/Language";
import { SubstatType } from "../types/Substat";
import { isAlphabet } from "./string";
import { str2artifactSet, str2stat, str2stats } from "./strToArtifact";

export type ArtifactScanOut = {
  setKey: ScanResSetKey;
  rarity: ScanResNum;
  level: ScanResNum;
  slotKey: ScanResSlotKey;
  mainstatKey: ScanResStatKey;
  substats: ScanResStat[];
};

export const ScanRes2GOOD = (scanned: ArtifactScanOut) => {
  return {
    setKey: scanned.setKey.key,
    rarity: scanned.rarity.value,
    level: scanned.level.value,
    slotKey: scanned.slotKey.value,
    mainstatKey: scanned.mainstatKey.key,
    substats: scanned.substats.map((substat) => {
      return { key: substat.key, value: substat.value } as SubstatType;
    }),
  } as ArtifactType;
};

export const ArtifactScan = async (
  src: cv.Mat,
  scale: number,
  left: cv.Mat,
  right: cv.Mat,
  mid: cv.Mat,
  buf: React.RefObject<HTMLCanvasElement>
) => {
  let strs = await ArtifactScanStr(src, scale, left, right, mid, buf);
  console.log(strs);
  let lang: Language = isAlphabet(strs.name.value.charAt(0)) ? "en" : "ja";
  let res = {} as ArtifactScanOut;
  let set = str2artifactSet(strs.name.value, lang);
  res.setKey = { key: set.key, confidence: set.confidence };
  res.rarity = {
    value: strs.star.value.replace(/\s/g, "").length,
    confidence: strs.star.confidence,
  };
  //could compare with main stat and improve accuracy
  res.level = {
    value: Number(strs.level.value.replace(/^\D+/g, "")),
    confidence: strs.level.confidence,
  };
  let mainstat = str2stat(
    strs.mainKey.value + "+" + strs.mainValue.value,
    lang
  );
  res.mainstatKey = { key: mainstat.key, confidence: mainstat.confidence };
  res.slotKey = { value: set.part, confidence: set.confidence };

  res.substats = str2stats(strs.substat.value, lang);
  return res;
};

//scale change sample size: larger precise, smaller faster
export type ArtifactScanStrOut = {
  name: ScanRes;
  part: ScanRes;
  mainKey: ScanRes;
  mainValue: ScanRes;
  star: ScanRes;
  level: ScanRes;
  substat: ScanRes;
};
export const ArtifactScanStr = async (
  src_: cv.Mat,
  scale: number,
  left: cv.Mat,
  right: cv.Mat,
  mid: cv.Mat,
  buf: React.RefObject<HTMLCanvasElement>
) => {
  let src = new cv.Mat();
  src_.copyTo(src);

  let res = {} as ArtifactScanStrOut;

  let aspect = src.size().width / src.size().height;
  cv.resize(src, src, new cv.Size(1280 * scale, (1280 * scale) / aspect)); //* RESIZE FOR FASTER RES,
  console.log(src.size());
  let color = new cv.Scalar(255, 0, 0, 255);

  let dst = new cv.Mat();
  let mask = new cv.Mat();
  cv.matchTemplate(src, right, dst, cv.TM_CCOEFF_NORMED, mask);
  let result = cv.minMaxLoc(dst, mask) as any as MinMaxLoc;
  let maxPoint = result.maxLoc;

  let point = new cv.Point(maxPoint.x + right.cols, maxPoint.y + right.rows);
  cv.rectangle(src, maxPoint, point, color, 2, cv.LINE_8, 0);
  console.log("img 0 match");

  cv.matchTemplate(src, left, dst, cv.TM_CCOEFF, mask);
  result = cv.minMaxLoc(dst, mask) as any as MinMaxLoc;
  let maxPoint2 = result.maxLoc;

  let point2 = new cv.Point(maxPoint2.x + left.cols, maxPoint2.y + left.rows);
  cv.rectangle(src, maxPoint2, point2, color, 2, cv.LINE_8, 0);
  console.log("img 1 match");

  let slimRect = new cv.Rect(
    maxPoint2.x,
    0,
    point.x - maxPoint2.x,
    src.size().height
  );
  let slimImg = src.roi(slimRect);
  //*RESIZE AFTER CLOP!!!!!!!!!
  aspect = slimImg.size().width / slimImg.size().height;

  cv.resize(slimImg, slimImg, new cv.Size(352 * scale, (352 * scale) / aspect));

  cv.matchTemplate(slimImg, mid, dst, cv.TM_CCOEFF, mask);
  result = cv.minMaxLoc(dst, mask) as any as MinMaxLoc;
  maxPoint = result.maxLoc;

  point = new cv.Point(maxPoint.x + mid.cols, maxPoint.y + mid.rows);
  cv.rectangle(slimImg, maxPoint, point, color, 2, cv.LINE_8, 0);

  console.log("slimmed");

  let midSeparator = maxPoint.y + mid.rows / 2;
  let topHalfHeight = 189;
  let topHalfBottom = 156;
  let topHalfR = new cv.Rect(
    12,
    midSeparator - topHalfHeight * scale,
    328 * scale,
    (topHalfHeight + topHalfBottom) * scale
  );
  let trimmedImg = slimImg.roi(topHalfR);
  cv.cvtColor(trimmedImg, trimmedImg, cv.COLOR_BGR2GRAY);

  console.log("trimmed");

  let name1p = new cv.Point(17 * scale, 6 * scale);
  let name2p = new cv.Point((17 + 295) * scale, (6 + 26) * scale);
  let part1p = new cv.Point(16 * scale, 46 * scale);
  let part2p = new cv.Point((16 + 130) * scale, (46 + 18) * scale);
  let mainKey1p = new cv.Point(16 * scale, 100 * scale);
  let mainKey2p = new cv.Point((16 + 130) * scale, (100 + 18) * scale);
  let mainValue1p = new cv.Point(16 * scale, 118 * scale);
  let mainValue2p = new cv.Point((16 + 102) * scale, (118 + 32) * scale);
  let star1p = new cv.Point(16 * scale, 156 * scale);
  let star2p = new cv.Point((16 + 116) * scale, (156 + 24) * scale);
  let level1p = new cv.Point(24 * scale, 208 * scale);
  let level2p = new cv.Point((24 + 32) * scale, (208 + 16) * scale);
  let substat1p = new cv.Point(32 * scale, 237 * scale);
  let substat2p = new cv.Point((32 + 198) * scale, (237 + 106) * scale);

  console.log("showTextImg");

  const fname = async () => {
    imshowTrimmed(buf, trimmedImg, 0.75, -180, name1p, name2p);
    let result = await Tesseract.recognize(buf.current!.toDataURL(), "jpn");
    res.name = { value: result.data.text, confidence: result.data.confidence };
    cv.rectangle(trimmedImg, name1p, name2p, color, 2, cv.LINE_8, 0);
  };
  const fpart = async () => {
    imshowTrimmed(buf, trimmedImg, 1, -180, part1p, part2p);
    let result = await Tesseract.recognize(buf.current!.toDataURL(), "jpn");
    res.part = { value: result.data.text, confidence: result.data.confidence };
    cv.rectangle(trimmedImg, part1p, part2p, color, 2, cv.LINE_8, 0);
  };

  const fmainKey = async () => {
    imshowTrimmed(buf, trimmedImg, 1, -135, mainKey1p, mainKey2p);
    let result = await Tesseract.recognize(buf.current!.toDataURL(), "jpn"); //nograyscale
    res.mainKey = {
      value: result.data.text,
      confidence: result.data.confidence,
    };
    cv.rectangle(trimmedImg, mainKey1p, mainKey2p, color, 2, cv.LINE_8, 0);
  };
  const fmainValue = async () => {
    imshowTrimmed(buf, trimmedImg, 0.75, -180, mainValue1p, mainValue2p);
    let result = await Tesseract.recognize(buf.current!.toDataURL());
    res.mainValue = {
      value: result.data.text,
      confidence: result.data.confidence,
    };
    cv.rectangle(trimmedImg, mainValue1p, mainValue2p, color, 2, cv.LINE_8, 0);
  };

  const fstar = async () => {
    imshowTrimmed(buf, trimmedImg, 1, -150, star1p, star2p);
    let result = await Tesseract.recognize(buf.current!.toDataURL(), "chi_tra");
    res.star = { value: result.data.text, confidence: result.data.confidence };
    cv.rectangle(trimmedImg, star1p, star2p, color, 2, cv.LINE_8, 0);
  };

  const flevel = async () => {
    imshowTrimmed(buf, trimmedImg, 1, -150, level1p, level2p);
    let result = await Tesseract.recognize(buf.current!.toDataURL()); //nograyscale
    res.level = { value: result.data.text, confidence: result.data.confidence };
    cv.rectangle(trimmedImg, level1p, level2p, color, 2, cv.LINE_8, 0);
  };

  const fsubstat = async () => {
    imshowTrimmed(buf, trimmedImg, 1, 140, substat1p, substat2p);
    let result = await Tesseract.recognize(buf.current!.toDataURL(), "jpn");
    res.substat = {
      value: result.data.text,
      confidence: result.data.confidence,
    };
    cv.rectangle(trimmedImg, substat1p, substat2p, color, 2, cv.LINE_8, 0);
  };

  console.log("Start tesseract");
  await Promise.all([
    fname(),
    fpart(),
    fmainKey(),
    fmainValue(),
    fstar(),
    flevel(),
    fsubstat(),
  ]);
  console.log("end tesseract");
  return res;
};

const imshowTrimmed = (
  ref: React.RefObject<HTMLCanvasElement>,
  src: cv.Mat,
  scale: number,
  threshold: number,
  p1: cv.Point,
  p2: cv.Point
) => {
  let i = src.roi(new Rect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y));
  cv.resize(i, i, new cv.Size(i.size().width * scale, i.size().height * scale));
  cv.threshold(
    i,
    i,
    Math.abs(threshold),
    255,
    threshold >= 0 ? cv.THRESH_BINARY : cv.THRESH_BINARY_INV
  );
  cv.imshow(ref.current!, i);
};

export type ScanRes = {
  value: string;
  confidence: number;
};

export type ScanResSlotKey = {
  value: slotKeyType;
  confidence: number;
};
export type ScanResNum = {
  value: number;
  confidence: number;
};

export type ScanResSetKey = {
  key: setKeyType;
  confidence: number;
};

export type ScanResStat = {
  key: statKeyType;
  value: number;
  confidence: number;
};

export type ScanResStatKey = {
  key: statKeyType;
  confidence: number;
};
