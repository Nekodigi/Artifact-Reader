import React, { useEffect, useRef, useState } from "react";
import cv from "@techstark/opencv-js";
import { loadHaarFaceModels, detectHaarFace } from "./haarFaceDetection";
import "./style.css";

//window.cv = cv;

export const TestPage = () => {
  const inputImgRef = useRef();
  const grayImgRef = useRef();
  const cannyEdgeRef = useRef();
  const haarFaceImgRef = useRef();
  const [img, setImg] = useState(null);

  useEffect(() => {
    loadHaarFaceModels();
  }, []);

  /////////////////////////////////////////
  //
  // process image with opencv.js
  //
  /////////////////////////////////////////
  useEffect(() => {
    //const i = await imreadUrl(imgSrc);
    if (img === null) return;

    cv.imshow(inputImgRef.current, img);
    // to gray scale
    const imgGray = new cv.Mat();
    cv.cvtColor(img, imgGray, cv.COLOR_BGR2GRAY);
    cv.imshow(grayImgRef.current, imgGray);

    // detect edges using Canny
    const edges = new cv.Mat();
    cv.Canny(imgGray, edges, 100, 100);
    cv.imshow(cannyEdgeRef.current, edges);

    // detect faces using Haar-cascade Detection
    const haarFaces = detectHaarFace(img);
    cv.imshow(haarFaceImgRef.current, haarFaces);

    // need to release them manually
    img.delete();
    imgGray.delete();
    edges.delete();
    haarFaces.delete();
  }, [img]);

  const imreadUrl = async (url) => {
    let e = await loadImage(url);
    console.log(e.target);
    return cv.imread(e.target);
  };

  const loadImage = (src) => {
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
        <span style={{ marginRight: "10px" }}>Select an image file:</span>
        <input
          type="file"
          name="file"
          accept="image/*"
          onChange={async (e) => {
            if (e.target.files[0]) {
              //setImgUrl(URL.createObjectURL(e.target.files[0]));
              let i = await imreadUrl(URL.createObjectURL(e.target.files[0]));
              setImg(i);
              //processImage(e.target.files[0].arrayBuffer());
              //processImageUrl(URL.createObjectURL(e.target.files[0]));
            }
          }}
        />
      </div>

      {img && (
        <div className="images-container">
          <div className="image-card">
            <div style={{ margin: "10px" }}>↓↓↓ The original image ↓↓↓</div>
            <canvas ref={inputImgRef} />
          </div>

          <div className="image-card">
            <div style={{ margin: "10px" }}>↓↓↓ The gray scale image ↓↓↓</div>
            <canvas ref={grayImgRef} />
          </div>

          <div className="image-card">
            <div style={{ margin: "10px" }}>↓↓↓ Canny Edge Result ↓↓↓</div>
            <canvas ref={cannyEdgeRef} />
          </div>

          <div className="image-card">
            <div style={{ margin: "10px" }}>
              ↓↓↓ Haar-cascade Face Detection Result ↓↓↓
            </div>
            <canvas ref={haarFaceImgRef} />
          </div>
        </div>
      )}
    </div>
  );
};
