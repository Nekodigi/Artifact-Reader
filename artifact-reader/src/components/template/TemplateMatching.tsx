import { Mat, MinMaxLoc, Rect } from "@techstark/opencv-js";
import React, { useEffect, useRef, useState } from "react";
import cv from "@techstark/opencv-js";
import Tesseract from "tesseract.js";
import { ArtifactScan, ScanRes2GOOD } from "../../utils/func/artifactScan";
import genshindb, { Language } from "genshin-db";

const TemplateMatching = () => {
  const targetImgRef = useRef<HTMLCanvasElement>(null);
  const templateImgRef = useRef<HTMLCanvasElement>(null);
  const slimImgRef = useRef<HTMLCanvasElement>(null);
  const trimmedImgRef = useRef<HTMLCanvasElement>(null);
  const nameImgRef = useRef<HTMLCanvasElement>(null);
  const partImgRef = useRef<HTMLCanvasElement>(null);
  const mainKeyImgRef = useRef<HTMLCanvasElement>(null);
  const mainValueImgRef = useRef<HTMLCanvasElement>(null);
  const starImgRef = useRef<HTMLCanvasElement>(null);
  const levelImgRef = useRef<HTMLCanvasElement>(null);
  const substatImgRef = useRef<HTMLCanvasElement>(null);
  const dummyImgRef = useRef<HTMLCanvasElement>(null);
  const [name, setName] = useState("name");
  const [part, setPart] = useState("part");
  const [mainKey, setMainKey] = useState("mainKey");
  const [mainValue, setMainValue] = useState("mainValue");
  const [star, setStar] = useState("star");
  const [level, setLevel] = useState("level");
  const [substat, setSubstat] = useState("substat");

  const [img, setImg] = useState<Mat | null>(null);
  const [templateImgs, setTemplateImgs] = useState<(Mat | null)[]>([
    null,
    null,
  ]); //this will be error cv is not initialized at first

  //PIPELINE
  //target => [targetSM, [LEFT, RIGHT]] => [slim] => [trimmed](just have to know top corner?)
  //if width > height
  //targetSM, (1280, 720)
  //else
  //targetSM, preserve
  //slim width: 272? padding: 20

  let scale = 1.5; //small faster large precise

  useEffect(() => {
    if (img === null || templateImgs[0] !== null) return;
    const loadTemplate = async () => {
      let i1 = await imreadUrl("template/right.png");
      cv.resize(
        i1,
        i1,
        new cv.Size(i1.size().width * scale, i1.size().height * scale)
      );
      let i2 = await imreadUrl("template/left.png");
      cv.resize(
        i2,
        i2,
        new cv.Size(i2.size().width * scale, i2.size().height * scale)
      );
      let i3 = await imreadUrl("template/mid.png");
      cv.resize(
        i3,
        i3,
        new cv.Size(i3.size().width * scale, i3.size().height * scale)
      );
      setTemplateImgs([i1, i2, i3]);
      console.log("SET IMAGE");
    };
    loadTemplate();
  }, [img]);

  useEffect(() => {
    if (
      img === null ||
      templateImgs[0] === null ||
      templateImgs[1] === null ||
      templateImgs[2] === null
    )
      return;
    const t = async () => {
      let res = await ArtifactScan(
        img,
        scale,
        templateImgs[1]!,
        templateImgs[0]!,
        templateImgs[2]!,
        nameImgRef
      );
      console.log(res);
      console.log(ScanRes2GOOD(res));
      //img will break after reading??
    };
    visualScan(img, templateImgs[1]!, templateImgs[0]!, templateImgs[2]!);
    t();

    //visualScan(img, templateImgs[1]!, templateImgs[0]!, templateImgs[2]!);

    //visualScan(img, templateImgs[1], templateImgs[0], templateImgs[2]);
  }, [img, templateImgs]);

  const visualScan = (
    img_: cv.Mat,
    left: cv.Mat,
    right: cv.Mat,
    mid: cv.Mat
  ) => {
    let img = new cv.Mat();
    img_.copyTo(img);
    let aspect = img.size().width / img.size().height;
    cv.resize(img, img, new cv.Size(1280 * scale, (1280 * scale) / aspect)); //* RESIZE FOR FASTER RES,
    console.log(img.size());
    let color = new cv.Scalar(255, 0, 0, 255);

    let dst = new cv.Mat();
    let mask = new cv.Mat();
    cv.matchTemplate(img, right, dst, cv.TM_CCOEFF_NORMED, mask);
    let result = cv.minMaxLoc(dst, mask) as any as MinMaxLoc;
    let maxPoint = result.maxLoc;

    let point = new cv.Point(maxPoint.x + right.cols, maxPoint.y + right.rows);
    cv.rectangle(img, maxPoint, point, color, 2, cv.LINE_8, 0);
    console.log("img 0 match");

    cv.matchTemplate(img, left, dst, cv.TM_CCOEFF, mask);
    result = cv.minMaxLoc(dst, mask) as any as MinMaxLoc;
    let maxPoint2 = result.maxLoc;

    let point2 = new cv.Point(maxPoint2.x + left.cols, maxPoint2.y + left.rows);
    cv.rectangle(img, maxPoint2, point2, color, 2, cv.LINE_8, 0);
    console.log("img 1 match");

    cv.imshow(targetImgRef.current!, img);
    cv.imshow(templateImgRef.current!, right);

    let slimRect = new cv.Rect(
      maxPoint2.x,
      0,
      point.x - maxPoint2.x,
      img.size().height
    );
    let slimImg = img.roi(slimRect);
    //*RESIZE AFTER CLOP!!!!!!!!!
    aspect = slimImg.size().width / slimImg.size().height;

    cv.resize(
      slimImg,
      slimImg,
      new cv.Size(352 * scale, (352 * scale) / aspect)
    );

    cv.matchTemplate(slimImg, mid, dst, cv.TM_CCOEFF, mask);
    result = cv.minMaxLoc(dst, mask) as any as MinMaxLoc;
    maxPoint = result.maxLoc;

    point = new cv.Point(maxPoint.x + mid.cols, maxPoint.y + mid.rows);
    cv.rectangle(slimImg, maxPoint, point, color, 2, cv.LINE_8, 0);

    console.log("slimmed");
    cv.imshow(slimImgRef.current!, slimImg);

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

    imshowTrimmed(mainKeyImgRef, trimmedImg, 1, -135, mainKey1p, mainKey2p);
    imshowTrimmed(
      mainValueImgRef,
      trimmedImg,
      0.75,
      -180,
      mainValue1p,
      mainValue2p
    );
    imshowTrimmed(starImgRef, trimmedImg, 1, -150, star1p, star2p);
    imshowTrimmed(levelImgRef, trimmedImg, 1, -150, level1p, level2p);
    imshowTrimmed(substatImgRef, trimmedImg, 1, 140, substat1p, substat2p);
    console.log("showTextImg");

    const fname = async () => {
      imshowTrimmed(nameImgRef, trimmedImg, 0.75, -180, name1p, name2p);
      let result = await Tesseract.recognize(
        nameImgRef.current!.toDataURL(),
        "jpn"
      );
      setName(`${result.data.text} : ${result.data.confidence}`);
      cv.rectangle(trimmedImg, name1p, name2p, color, 2, cv.LINE_8, 0);
    };
    const fpart = async () => {
      imshowTrimmed(partImgRef, trimmedImg, 1, -180, part1p, part2p);
      let result = await Tesseract.recognize(
        partImgRef.current!.toDataURL(),
        "jpn"
      );
      setPart(`${result.data.text} : ${result.data.confidence}`);
      cv.rectangle(trimmedImg, part1p, part2p, color, 2, cv.LINE_8, 0);
    };

    const fmainKey = async () => {
      let result = await Tesseract.recognize(
        mainKeyImgRef.current!.toDataURL(),
        "jpn"
      ); //nograyscale
      setMainKey(`${result.data.text} : ${result.data.confidence}`);
      cv.rectangle(trimmedImg, mainKey1p, mainKey2p, color, 2, cv.LINE_8, 0);
    };
    const fmainValue = async () => {
      let result = await Tesseract.recognize(
        mainValueImgRef.current!.toDataURL()
      );
      setMainValue(`${result.data.text} : ${result.data.confidence}`);
      cv.rectangle(
        trimmedImg,
        mainValue1p,
        mainValue2p,
        color,
        2,
        cv.LINE_8,
        0
      );
    };

    const fstar = async () => {
      let result = await Tesseract.recognize(
        starImgRef.current!.toDataURL(),
        "chi_tra"
      );
      setStar(`${result.data.text} : ${result.data.confidence}`);
      cv.rectangle(trimmedImg, star1p, star2p, color, 2, cv.LINE_8, 0);
    };

    const flevel = async () => {
      let result = await Tesseract.recognize(levelImgRef.current!.toDataURL()); //nograyscale
      setLevel(`${result.data.text} : ${result.data.confidence}`);
      cv.rectangle(trimmedImg, level1p, level2p, color, 2, cv.LINE_8, 0);
    };

    const fsubstat = async () => {
      let result = await Tesseract.recognize(
        substatImgRef.current!.toDataURL(),
        "jpn"
      );
      setSubstat(`${result.data.text} : ${result.data.confidence}`);
      cv.rectangle(trimmedImg, substat1p, substat2p, color, 2, cv.LINE_8, 0);
    };

    const t = async () => {
      await Promise.all([
        fname(),
        fpart(),
        fmainKey(),
        fmainValue(),
        fstar(),
        flevel(),
        fsubstat(),
      ]);
      cv.imshow(trimmedImgRef.current!, trimmedImg);
    };
    t();
  };

  const imreadUrl = async (url: string): Promise<Mat> => {
    let e = await loadImage(url);
    console.log(e.target);
    return cv.imread(e.target as HTMLElement);
  };

  const loadImage = (src: string): Promise<Event> => {
    return new Promise((resolve, reject) => {
      const i = new Image();
      i.onload = (e) => resolve(e);
      i.onerror = (e) => reject(e);
      i.src = src;
    });
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
    cv.resize(
      i,
      i,
      new cv.Size(i.size().width * scale, i.size().height * scale)
    );
    cv.threshold(
      i,
      i,
      Math.abs(threshold),
      255,
      threshold >= 0 ? cv.THRESH_BINARY : cv.THRESH_BINARY_INV
    );
    cv.imshow(ref.current!, i);
  };

  return (
    <div>
      <div style={{ marginTop: "30px" }}>
        <span style={{ marginRight: "10px" }}>Select an target file:</span>
        <input
          type="file"
          name="file"
          accept="image/*"
          onChange={async (e) => {
            if (e.target.files && e.target.files[0]) {
              //setImgUrl(URL.createObjectURL(e.target.files[0]));
              let i = await imreadUrl(URL.createObjectURL(e.target.files[0]));
              setImg(i);

              //processImage(e.target.files[0].arrayBuffer());
              //processImageUrl(URL.createObjectURL(e.target.files[0]));
            }
          }}
        />
      </div>

      <div style={{ marginTop: "30px" }}>
        <span style={{ marginRight: "10px" }}>
          Open console.log to check result
        </span>
      </div>

      <canvas ref={dummyImgRef} style={{ display: "none" }} />
      <div className="image-card">
        <div style={{ margin: "10px" }}>↓↓↓ The text image ↓↓↓{name}</div>
        <canvas ref={nameImgRef} />
      </div>
      <div className="image-card">
        <div style={{ margin: "10px" }}>↓↓↓ The text image ↓↓↓{part}</div>
        <canvas ref={partImgRef} />
      </div>
      <div className="image-card">
        <div style={{ margin: "10px" }}>↓↓↓ The text image ↓↓↓{mainKey}</div>
        <canvas ref={mainKeyImgRef} />
      </div>
      <div className="image-card">
        <div style={{ margin: "10px" }}>↓↓↓ The text image ↓↓↓{mainValue}</div>
        <canvas ref={mainValueImgRef} />
      </div>
      <div className="image-card">
        <div style={{ margin: "10px" }}>↓↓↓ The text image ↓↓↓{star}</div>
        <canvas ref={starImgRef} />
      </div>
      <div className="image-card">
        <div style={{ margin: "10px" }}>↓↓↓ The text image ↓↓↓{level}</div>
        <canvas ref={levelImgRef} />
      </div>
      <div className="image-card">
        <div style={{ margin: "10px" }}>↓↓↓ The text image ↓↓↓{substat}</div>
        <canvas ref={substatImgRef} />
      </div>

      <div className="image-card">
        <div style={{ margin: "10px" }}>↓↓↓ The template image ↓↓↓</div>
        <canvas ref={templateImgRef} width={1000} />
      </div>

      <div className="image-card">
        <div style={{ margin: "10px" }}>↓↓↓ The target image ↓↓↓</div>
        <canvas ref={targetImgRef} style={{ maxWidth: "80vw" }} />
      </div>
      <div className="image-card">
        <div style={{ margin: "10px" }}>↓↓↓ The slim image ↓↓↓</div>
        <canvas ref={slimImgRef} />
      </div>
      <div className="image-card">
        <div style={{ margin: "10px" }}>↓↓↓ The trimmed image ↓↓↓</div>
        <canvas ref={trimmedImgRef} />
      </div>
    </div>
  );
};

export default TemplateMatching;
