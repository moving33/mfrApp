import style from "../Css/Main.module.css";
import React, { useRef, useState, useCallback, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/facemesh";
import * as blazeface from "@tensorflow-models/blazeface";
import Webcam from "react-webcam";

import qs from "qs";

import closePng from "../assets/close.png";
import utils from "../utils";
import SubmitButton from "../Component/SubmitButton";
import Box from "../Component/Box";
import CheckTextFields from "../Component/CheckTextFields";

import ProgressCircle from "../Component/ProgressCircle";
import cameraPng from "../assets/camera.png";
import NoImage from "../Component/NoImage";

import { ReactComponent as WrieframeSvg } from "../assets/wireframe.svg";
import { ReactComponent as WrieframeDetectSvg } from "../assets/wireframe-detect.svg";
import { useHistory } from "react-router";
import { PREFIX,API_URL } from "../config";
import axios from "axios";



const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: "user",
};

function Camera() {
  const history = useHistory();
  const webcamRef = useRef(null);
  const intervalIdRef = useRef(null);
  const canvasRef = useRef();

  const [data, setData] = useState();
  const [imgList, setImgList] = useState([]);
  const [webFace, setWebFace] = useState([]);
  const [detected, setDetected] = useState(false);
  const [captured, setCaptured] = useState(false);
  const captureIdxRef = useRef(0);
  // const [captureIdx, setCaptureIdx] = useState(0);
  const [step, setStep] = useState(0); // 0: 확인메시지창, 1: 카메라 화면, 2. 확인 화면, 3. 결고 화면
  const [capturePlay, setCapturePlay] = useState(false);

  const capture = () => {
    setCaptured(true);
    setCapturePlay(true);
  };

  const handleCaptureComplete = (detected) => {
    setDetected(false);
    setCaptured(false);
    setCapturePlay(false);

    if (!webcamRef.current || !detected) {
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot({width: 200,height:256});
    console.log("imageSrc ::: ", imageSrc);
    const _imgList = JSON.parse(JSON.stringify(imgList));

    _imgList[captureIdxRef.current] = { src: imageSrc };
    setImgList(_imgList);


    clearInterval(intervalIdRef.current);
    setStep(2);
  };

  const runFacemesh = async () => {
    const net = await blazeface.load();
    // const net = await facemesh.load({
    //   inputResolution: {
    //     width: 3200,
    //     height: 2400,
    //   },
    //   scale: 0.8,
    // });

    intervalIdRef.current = setInterval(() => {
      detect(net);
    }, 500);
  };

  const detect = async (net) => {
    if (
        typeof webcamRef.current !== "undefined" &&
        webcamRef.current !== null &&
        webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      const _webFace = await net.estimateFaces(video);

      // console.log(_webFace);

      // const ctx = canvasRef.current.getContext('2d');
      // ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      // for (let i = 0; i < _webFace.length; i++) {
      //   const start = _webFace[i].topLeft;
      //   const end = _webFace[i].bottomRight;

      //   const size = [end[0] - start[0], end[1] - start[1]];
      //   console.log(start, end, size);

      //   // Render a rectangle over each detected face.
      //   // ctx.fillStyle = 'green';
      //   // ctx.fillRect(start[0], start[1], size[0], size[1]);
      // }

      if (_webFace.length === 1) {
        // console.log(_webFace[0])
        const { topLeft, bottomRight } = _webFace[0];
        if (


            topLeft[0] > 80 &&
            topLeft[0] < 470 &&
            topLeft[1] > 80 &&
            topLeft[1] < 740 &&
            bottomRight[0] > 80 &&
            bottomRight[0] < 470 &&
            bottomRight[1] > 80 &&
            bottomRight[1] < 470

            // topLeft[0] > 150 &&
            // topLeft[0] < 230 &&
            // topLeft[1] > 160 &&
            // topLeft[1] < 240 &&
            // bottomRight[0] > 440 &&
            // bottomRight[0] < 520 &&
            // bottomRight[1] > 340 &&
            // bottomRight[1] < 420

        ) {
          console.log(detected, captured, capturePlay, topLeft, bottomRight);
          setDetected(true);

          if (!captured) {
            // alert('detact!!! ::: ' + JSON.stringify(topLeft) + ' ::: ' + JSON.stringify(bottomRight));
            // console.log(topLeft, bottomRight);

            // clearInterval(intervalIdRef.current);
            setWebFace(_webFace);

            capture();

          }
        } else {
          setDetected(false);
        }
      }
    }
  };

  const closeCam = () => {
    if (data.isGlass && imgList?.length > 0) {
      // 안경 썻음 (2회 촬영)
      setStep(2);
    } else if (imgList?.length > 0) {
      setStep(2);
    } else {
      // 안경 안썻음 (1회 촬영)
      setStep(0);
    }
  };

  const cancel = () => {
    setImgList([]);
    setStep(0);
  };


  const submit = () => {

    const img = imgList[0].src.split(',')[1]
    const payload = {
      step_idx: data.step_idx,
      classId: data.class_id,
      bussiId: data.employeeNumber,
      phtoCnt: data.isGlass? '2':'1',
      photos: [{
        seqNo : '1'
        ,isGlass : false
        ,faceX : '0'
        ,faceY : '255'
        ,photoData : img
        ,faceWidth: "129"
        ,faceHeight: "256"
      }]
    }
    axios.post(`${API_URL}/v1/fileTrans`, payload)
        .then((res) => {
          if(res.data.result === 'true'){
            setStep(3);
          }
        })
    console.log(data, imgList)
  };

  const reopenCamera = (captureIdx) => {
    // setCaptureIdx(0);
    captureIdxRef.current = captureIdx;
    setStep(1);
  };



  useEffect(() => {
    const { q } = qs.parse(window.location.search.slice(1));
    const _data = JSON.parse(utils.decode(q));
    console.log(_data)
    setData(_data);


    // test
    // setTimeout(() => {
    //   setCapturePlay(true);
    // }, 1000);

    return () => {
      clearInterval(intervalIdRef.current);
    };
  }, []);

  // useEffect(() => {
  //   console.log(detected)
  // },[detected])

  useEffect(() => {
    if (step === 1) {
      setWebFace([]);
      runFacemesh();
    }

    if (step === 2) {
      const _w = window.innerWidth;
      const _h = window.innerHeight;
      const canvas = document.createElement("canvas");
      canvas.width = 360;
      canvas.height = 360;
      const ctx = canvas.getContext("2d");
      const imageObj = new Image();
      imageObj.width = _w + "px";
      imageObj.height = _w + "px";

      imageObj.onload = function () {
        const sx = -40;
        //const sy = (500 - 480) / 2;
        const sy = -15;
        const sw = 800;
        const sh = 800;
        const dx = 0;
        const dy = 0;
        const dw = 1000;
        const dh = 1000;

        ctx.drawImage(imageObj, sx, sy, sw, sh, dx, dy, dw, dh);
        const _imgList = JSON.parse(JSON.stringify(imgList));

        _imgList[captureIdxRef.current] = {
          ...imgList[captureIdxRef.current],
          croped: canvas.toDataURL(),
        };
        setImgList(_imgList);
      };

      imageObj.src = imgList[captureIdxRef.current].src;
    }
  }, [step]);



  return (
      <>
        {step === 0 && (
            <div className={style.container}>
              <Box step={3} text1="이렇게 하면" text2="얼굴인식이 잘 돼요" />
              <div className={style.group17}></div>
              <WrieframeSvg
                  className={`${style.wireframeIcon} ${
                      detected ? style.detected : ""
                  }`}
              />
              <CheckTextFields />
              <form className={style.mainForm}>
                <SubmitButton
                    type="button"
                    label={"촬영하기"}
                    onClick={() => {
                      setStep(1);
                    }}
                />
              </form>
            </div>
        )}
        {step === 1 && (
            <div className={style.cameraBackground}>
              <div className={style.cameraTopContainer}>
                <img
                    src={closePng}
                    className={style.closeButton}
                    onClick={closeCam}
                />
              </div>
              <div className={style.coverDiv}>
                <div className={style.drowingContainer}>
                  <div className={style.drowingContainer2}>
                    {/* { webFace.length === 0  && ( <div className={style.drowing}></div> ) }
              { webFace.length !== 0  && ( <div className={style.drowDelete}></div> ) } */}
                    {!detected && <WrieframeSvg className={style.wireframeIcon} />}
                    {detected && (
                        <WrieframeDetectSvg className={style.wireframeIcon} />
                    )}
                  </div>
                </div>
                <div className={style.webcamContainer}>
                  <canvas
                      ref={canvasRef}
                      className={style.camera}
                      style={{ position: "absolute", zIndex: 3 }}
                  ></canvas>
                  <Webcam
                      ref={webcamRef}
                      videoConstraints={videoConstraints}
                      mirrored={true}
                      className={style.camera}
                  />
                </div>
                {detected === true
                    ?  <div className={style.webcamInfoText}>
                      <span>얼굴을 정면으로 응시해주세요</span>
                      <ProgressCircle
                          capturePlay={capturePlay}
                          onComplete={handleCaptureComplete}
                          detected={detected}
                          setDetected={setDetected}
                      />
                    </div>
                    : <div className={style.webcamInfoText}>
                      <span>눈, 코, 입이 보이게 촬영해주세요</span>
                      <ProgressCircle
                          capturePlay={capturePlay}
                          onComplete={handleCaptureComplete}
                      />
                    </div>}
              </div>
            </div>
        )}
        {step === 2 && (
            <div className={style.container}>
              {data?.isGlass && imgList.length < 2 && (
                  <Box step={4} text1="안경을 벗고" text2="한번 더 찍어주세요" />
              )}
              {((data?.isGlass && imgList.length === 2) ||
                  (!data?.isGlass && imgList.length === 1)) && (
                  <Box step={4} text1="사진이 잘 찍혔는지" text2="확인해주세요" />
              )}
              <div className={style.group17}></div>

              {!data?.isGlass && imgList[0]?.croped && (
                  <div className={style.confirmImageContainer}>
                    <img src={imgList[0].croped} className={style.singleImage}/>
                    <div
                        className={style.reopenCamera}
                        onClick={() => {
                          reopenCamera(0);
                        }}
                    >
                      <img src={cameraPng} className={style.cameraImage} />
                      다시찍기
                    </div>
                  </div>
              )}

              {data?.isGlass && (
                  <>
                    {imgList[0]?.croped && (
                        <div className={style.confirmImageContainer2Wrapper}>
                          <div className={style.confirmImageContainer2}>
                            {imgList[0]?.croped && (
                                <img
                                    src={imgList[0]?.croped}
                                    className={style.twoImage}
                                />
                            )}
                            <div
                                className={style.reopenCamera}
                                onClick={() => {
                                  reopenCamera(0);
                                }}
                            >
                              <img src={cameraPng} className={style.cameraImage} />
                              다시찍기
                            </div>
                          </div>
                          <div className={style.confirmImageContainer2}>
                            {imgList[1]?.croped && (
                                <img
                                    src={imgList[1]?.croped}
                                    className={style.twoImage}
                                />
                            )}
                            {!imgList[1]?.croped && (
                                <NoImage
                                    onClick={() => {
                                      reopenCamera(1);
                                    }}
                                />
                            )}
                            {imgList[1]?.croped && (
                                <div
                                    className={style.reopenCamera}
                                    onClick={() => {
                                      reopenCamera(1);
                                    }}
                                >
                                  <img src={cameraPng} className={style.cameraImage} />
                                  다시찍기
                                </div>
                            )}
                          </div>
                        </div>
                    )}
                  </>
              )}

              <div className={style.cameraButtonsContainer}>
                <button onClick={cancel} className={style.cameraCancelButton}>
                  등록 취소
                  {}
                </button>
                <button
                    onClick={submit}
                    className={style.cameraSubmitButton}
                    disabled={
                      data.isGlass ? imgList.length !== 2 : imgList.length !== 1
                    }
                >
                  사진 등록
                </button>
              </div>
            </div>
        )}
        {step === 3 && (
            <>
              <div className={style.resultMessage}>
                <div>얼굴등록이</div>
                <div>완료 되었습니다</div>
              </div>
              <div className={style.resultSubMessage}>
                <div>출입등록이 가능해지면</div>
                <div>문자로 알려 드릴게요!</div>
              </div>
            </>
        )}
      </>
  );
}

export default Camera;