import { Mat, MinMaxLoc } from "@techstark/opencv-js";
import React, { useEffect, useRef, useState } from "react";
import cv from "@techstark/opencv-js";

export const TemplateMatching = () => {
  const targetImgRef = useRef<HTMLCanvasElement>(null);
  const templateImgRef = useRef<HTMLCanvasElement>(null);
  const slimImgRef = useRef<HTMLCanvasElement>(null);
  const trimmedImgRef = useRef<HTMLCanvasElement>(null);

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
    if (img === null) return;
    const loadTemplate = async () => {
      let i1 = await imreadUrl("template/right.png");
      let i2 = await imreadUrl("template/left.png");
      let i3 = await imreadUrl("template/leftTop.png");
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
    cv.matchTemplate(img, templateImgs[0], dst, cv.TM_CCOEFF, mask);
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

    // let left1 = new cv.Point(875, 75);
    // let left2 = new cv.Point(875 + 24, 75 + 256);
    // let leftTop1 = new cv.Point(875, 75);
    // let leftTop2 = new cv.Point(875 + 24, 75 + 32);

    // let right1 = new cv.Point(1147, 75);
    // let right2 = new cv.Point(1147 + 24, 75 + 256);
    // let leftTopR = new cv.Rect(right1.x, right1.y, 24, 256);
    // cv.rectangle(img, left1, left2, color, 2, cv.LINE_8, 0);
    // cv.rectangle(img, leftTop1, leftTop2, color, 2, cv.LINE_8, 0);
    // cv.rectangle(img, right1, right2, color, 2, cv.LINE_8, 0);

    //img.roi(leftTopR) let leftTopR = new cv.Rect(right1.x, right1.y, 24, 256);
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
    cv.resize(slimImg, slimImg, new cv.Size(296, 296 / aspect));

    cv.matchTemplate(slimImg, templateImgs[2], dst, cv.TM_CCOEFF, mask);
    result = cv.minMaxLoc(dst, mask) as any as MinMaxLoc;
    maxPoint = result.maxLoc;

    point = new cv.Point(
      maxPoint.x + templateImgs[2].cols,
      maxPoint.y + templateImgs[2].rows
    );
    cv.rectangle(slimImg, maxPoint, point, color, 2, cv.LINE_8, 0);

    cv.imshow(slimImgRef.current!, slimImg);
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
