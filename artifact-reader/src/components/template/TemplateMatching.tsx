import { Mat, MinMaxLoc, Rect } from "@techstark/opencv-js";
import React, { useEffect, useRef, useState } from "react";
import cv from "@techstark/opencv-js";
import Tesseract from "tesseract.js";

export const TemplateMatching = () => {
  const targetImgRef = useRef<HTMLCanvasElement>(null);
  const templateImgRef = useRef<HTMLCanvasElement>(null);
  const slimImgRef = useRef<HTMLCanvasElement>(null);
  const trimmedImgRef = useRef<HTMLCanvasElement>(null);
  const textImgRef = useRef<HTMLCanvasElement>(null);
  const textImgRef2 = useRef<HTMLCanvasElement>(null);
  const textImgRef3 = useRef<HTMLCanvasElement>(null);
  const textImgRef4 = useRef<HTMLCanvasElement>(null);
  const [text1, setText1] = useState("res");
  const [text2, setText2] = useState("res");
  const [text3, setText3] = useState("res");
  const [text4, setText4] = useState("res");

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

  useEffect(() => {
    if (img === null || templateImgs[0] !== null) return;
    const loadTemplate = async () => {
      let i1 = await imreadUrl("template/right.png");
      let i2 = await imreadUrl("template/left.png");
      let i3 = await imreadUrl("template/mid.png");
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
    let aspect = img.size().width / img.size().height;
    cv.resize(img, img, new cv.Size(1280, 1280 / aspect)); //* RESIZE FOR FASTER RES,
    console.log(img.size());
    let color = new cv.Scalar(255, 0, 0, 255);

    let dst = new cv.Mat();
    let mask = new cv.Mat();
    cv.matchTemplate(img, templateImgs[0], dst, cv.TM_CCOEFF_NORMED, mask);
    let result = cv.minMaxLoc(dst, mask) as any as MinMaxLoc;
    let maxPoint = result.maxLoc;

    let point = new cv.Point(
      maxPoint.x + templateImgs[0].cols,
      maxPoint.y + templateImgs[0].rows
    );
    cv.rectangle(img, maxPoint, point, color, 2, cv.LINE_8, 0);
    console.log("img 0 match");

    cv.matchTemplate(img, templateImgs[1], dst, cv.TM_CCOEFF, mask);
    result = cv.minMaxLoc(dst, mask) as any as MinMaxLoc;
    let maxPoint2 = result.maxLoc;

    let point2 = new cv.Point(
      maxPoint2.x + templateImgs[1].cols,
      maxPoint2.y + templateImgs[1].rows
    );
    cv.rectangle(img, maxPoint2, point2, color, 2, cv.LINE_8, 0);
    console.log("img 1 match");

    cv.imshow(targetImgRef.current!, img);
    cv.imshow(templateImgRef.current!, templateImgs[0]);

    let slimRect = new cv.Rect(
      maxPoint2.x,
      0,
      point.x - maxPoint2.x,
      img.size().height
    );
    let slimImg = img.roi(slimRect);
    //*RESIZE AFTER CLOP!!!!!!!!!
    aspect = slimImg.size().width / slimImg.size().height;
    cv.resize(slimImg, slimImg, new cv.Size(352, 352 / aspect));

    cv.matchTemplate(slimImg, templateImgs[2], dst, cv.TM_CCOEFF, mask);
    result = cv.minMaxLoc(dst, mask) as any as MinMaxLoc;
    maxPoint = result.maxLoc;

    point = new cv.Point(
      maxPoint.x + templateImgs[2].cols,
      maxPoint.y + templateImgs[2].rows
    );
    cv.rectangle(slimImg, maxPoint, point, color, 2, cv.LINE_8, 0);

    console.log("slimmed");
    cv.imshow(slimImgRef.current!, slimImg);

    let midSeparator = maxPoint.y + templateImgs[2].rows / 2;
    let topHalfHeight = 189;
    let topHalfBottom = 152;
    let topHalfR = new cv.Rect(
      12,
      midSeparator - topHalfHeight,
      328,
      topHalfHeight + topHalfBottom
    );
    let trimmedImg = slimImg.roi(topHalfR);
    cv.cvtColor(trimmedImg, trimmedImg, cv.COLOR_BGR2GRAY);
    // cv.threshold(trimmedImg, trimmedImg, 120, 255, cv.THRESH_BINARY);
    //cv.threshold(trimmedImg, trimmedImg, 140, 255, cv.THRESH_BINARY);

    console.log("trimmed");

    let name1p = new cv.Point(17, 6);
    let name2p = new cv.Point(17 + 295, 6 + 26);
    let part1p = new cv.Point(16, 46);
    let part2p = new cv.Point(16 + 130, 46 + 18);
    let mainKey1p = new cv.Point(16, 100);
    let mainKey2p = new cv.Point(16 + 130, 100 + 18);
    let mainValue1p = new cv.Point(16, 118);
    let mainValue2p = new cv.Point(16 + 102, 118 + 32);
    let star1p = new cv.Point(16, 156);
    let star2p = new cv.Point(16 + 116, 156 + 24);
    let level1p = new cv.Point(20, 207);
    let level2p = new cv.Point(20 + 36, 207 + 16);
    let substat1p = new cv.Point(32, 237);
    let substat2p = new cv.Point(32 + 198, 237 + 102);
    cv.imshow(
      textImgRef.current!,
      trimmedImg.roi(
        new Rect(
          level1p.x,
          level1p.y,
          level2p.x - level1p.x,
          level2p.y - level1p.y
        )
      )
    );

    cv.imshow(
      textImgRef2.current!,
      trimmedImg.roi(
        new Rect(
          substat1p.x,
          substat1p.y,
          substat2p.x - substat1p.x,
          substat2p.y - substat1p.y
        )
      )
    );
    cv.imshow(
      textImgRef3.current!,
      trimmedImg.roi(
        new Rect(star1p.x, star1p.y, star2p.x - star1p.x, star2p.y - star1p.y)
      )
    );
    cv.imshow(
      textImgRef4.current!,
      trimmedImg.roi(
        new Rect(
          mainKey1p.x,
          mainKey1p.y,
          mainKey2p.x - mainKey1p.x,
          mainKey2p.y - mainKey1p.y
        )
      )
    );

    const t = async () => {
      let result = await Tesseract.recognize(
        textImgRef.current!.toDataURL(),
        "jpn"
      );
      setText1(result.data.text);
      result = await Tesseract.recognize(
        textImgRef2.current!.toDataURL(),
        "jpn"
      );
      setText2(result.data.text);
      result = await Tesseract.recognize(textImgRef3.current!.toDataURL()); //nograyscale
      setText3(result.data.text);
      result = await Tesseract.recognize(
        textImgRef4.current!.toDataURL(),
        "jpn"
      );
      setText4(result.data.text);
    };
    t();
    // let textImg = trimmedImg.roi(
    //   new Rect(part1p.x, part2p.y, part2p.x - part1p.x, part2p.y - part1p.y)
    // );
    // let textImg = trimmedImg.roi(
    //   new Rect(
    //     mainKey1p.x,
    //     mainKey1p.y,
    //     mainKey2p.x - mainKey1p.x,
    //     mainKey2p.y - mainKey1p.y
    //   )
    // );

    cv.rectangle(trimmedImg, name1p, name2p, color, 2, cv.LINE_8, 0);
    cv.rectangle(trimmedImg, part1p, part2p, color, 2, cv.LINE_8, 0);
    cv.rectangle(trimmedImg, mainKey1p, mainKey2p, color, 2, cv.LINE_8, 0);
    cv.rectangle(trimmedImg, mainValue1p, mainValue2p, color, 2, cv.LINE_8, 0);
    cv.rectangle(trimmedImg, star1p, star2p, color, 2, cv.LINE_8, 0);

    cv.imshow(trimmedImgRef.current!, trimmedImg);
  }, [img, templateImgs]);

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
        <span style={{ marginRight: "10px" }}>Select an template file:</span>
        <input
          type="file"
          name="file"
          accept="image/*"
          onChange={async (e) => {
            if (e.target.files && e.target.files[0]) {
              //setImgUrl(URL.createObjectURL(e.target.files[0]));
              let i = await imreadUrl(URL.createObjectURL(e.target.files[0]));
              setTemplateImgs([i]);

              //processImage(e.target.files[0].arrayBuffer());
              //processImageUrl(URL.createObjectURL(e.target.files[0]));
            }
          }}
        />
      </div>

      <div className="image-card">
        <div style={{ margin: "10px" }}>↓↓↓ The text image ↓↓↓{text1}</div>
        <canvas ref={textImgRef} />
      </div>
      <div className="image-card">
        <div style={{ margin: "10px" }}>↓↓↓ The text image ↓↓↓{text2}</div>
        <canvas ref={textImgRef2} />
      </div>
      <div className="image-card">
        <div style={{ margin: "10px" }}>↓↓↓ The text image ↓↓↓{text3}</div>
        <canvas ref={textImgRef3} />
      </div>
      <div className="image-card">
        <div style={{ margin: "10px" }}>↓↓↓ The text image ↓↓↓{text4}</div>
        <canvas ref={textImgRef4} />
      </div>

      <div className="image-card">
        <div style={{ margin: "10px" }}>↓↓↓ The template image ↓↓↓</div>
        <canvas ref={templateImgRef} width={1000} />
      </div>

      <div className="image-card">
        <div style={{ margin: "10px" }}>↓↓↓ The target image ↓↓↓</div>
        <canvas ref={targetImgRef} />
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
