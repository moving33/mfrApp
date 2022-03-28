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
import { PREFIX, API_URL } from "../config";
import axios from "axios";

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: "user",
};

function Camera() {
  const history = useHistory();
  const [ready, setReady] = useState(false);
  const webcamRef = useRef(null);
  const intervalIdRef = useRef(null);
  const canvasRef = useRef();
  const [faceX, setFaceX] = useState();
  const [faceY, setFaceY] = useState();
  const [faceIdTop, setFaceIdTop] = useState();
  const [faceIdWidth, setFaceWidth] = useState();
  const [data, setData] = useState();
  const [imgList, setImgList] = useState([]);
  const [webFace, setWebFace] = useState([]);
  const [detected, setDetected] = useState(false);
  const [captured, setCaptured] = useState(false);
  const captureIdxRef = useRef(0);
  // const [captureIdx, setCaptureIdx] = useState(0);
  const [step, setStep] = useState(0); // 0: 확인메시지창, 1: 카메라 화면, 2. 확인 화면, 3. 결과 화면
  const [capturePlay, setCapturePlay] = useState(false);
  const [open, setOpen] = useState(false);

  const noneSubmitImageList = []

  useEffect(() => {
    const { q } = qs.parse(window.location.search.slice(1));
    const _data = JSON.parse(utils.decode(q));
    console.log("data :", _data);
    setData(_data);

    return () => {
      clearInterval(intervalIdRef.current);
    };
  }, []);

  const capture = () => {
    setCaptured(true);
    setCapturePlay(true);
  };

  const _imgList = JSON.parse(JSON.stringify(imgList));

  const handleCaptureComplete = (detected) => {

    setReady(false);
    setDetected(false);
    setCaptured(false);
    setCapturePlay(false);

    if (!webcamRef.current || !detected) {
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot({ height: 512 });

    _imgList[captureIdxRef.current] = { src: imageSrc };

    console.log("_imgList Before ::: ", _imgList);

    setTimeout(() => {

      const imageSrc2 = webcamRef.current.getScreenshot({ height: 512 });

      _imgList[(captureIdxRef.current) + 2] = { src: imageSrc2 };

      console.log("_imgList After  ::: ", _imgList);

      console.log(captureIdxRef.current);

      setImgList(_imgList);

      clearInterval(intervalIdRef.current);

      setStep(2);

    }, 100);

  };

  const runFacemesh = async () => {
    const net = await blazeface.load();

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

      // console.log('_webFace', _webFace);

      if (_webFace.length === 1) {

        const { topLeft, bottomRight, landmarks } = _webFace[0];

        if (

          topLeft[0] > 80 &&
          topLeft[0] < 470 &&
          topLeft[1] > 80 &&
          topLeft[1] < 740 &&
          bottomRight[0] > 80 &&
          bottomRight[0] < 470 &&
          bottomRight[1] > 80 &&
          bottomRight[1] < 470

        ) {

          setFaceIdTop(bottomRight[1] - topLeft[1]);
          setFaceWidth(landmarks[5][0] - landmarks[4][0]);
          setFaceY(topLeft);
          setFaceX(bottomRight);
          setDetected(true);

          if (!captured) {
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
    // setImgList([]);
    // setStep(0);
    window.location.reload();
  };

  const submit = () => {

    console.log('submit ImgList', imgList);

    let payload = {}

    if (imgList.length === 4) {

      const img = imgList[0].src.split(',')[1];
      const img2 = imgList[1].src.split(',')[1];
      const img3 = imgList[2].src.split(',')[1];
      const img4 = imgList[3].src.split(',')[1];

      payload = {
        step_idx: data.step_idx,
        classId: data.class_id,
        bussiId: data.emNum,
        phtoCnt: data.isGlass ? '2' : '1',
        photos: [{
          seqNo: '1',
          isGlass: false,
          photoData: img,
          faceHight: parseInt(faceIdTop),
          faceWidth: parseInt(faceIdWidth),
          faceX: faceX,
          faceY: faceY,
        }, {
          seqNo: '2',
          isGlass: true,
          photoData: img2,
          faceHight: parseInt(faceIdTop),
          faceWidth: parseInt(faceIdWidth),
          faceX: faceX,
          faceY: faceY,
        },
        {
          seqNo: '3',
          isGlass: true,
          photoData: img3,
          faceHight: parseInt(faceIdTop),
          faceWidth: parseInt(faceIdWidth),
          faceX: faceX,
          faceY: faceY,
        },
        {
          seqNo: '4',
          isGlass: true,
          photoData: img4,
          faceHight: parseInt(faceIdTop),
          faceWidth: parseInt(faceIdWidth),
          faceX: faceX,
          faceY: faceY,
        }],
      }
    }
    if (imgList.length === 3) {

      const img = imgList[0].src.split(',')[1];
      const img2 = imgList[2].src.split(',')[1];

      payload = {
        step_idx: data.step_idx,
        classId: data.class_id,
        bussiId: data.emNum,
        phtoCnt: data.isGlass ? '2' : '1',
        photos: [{
          seqNo: '1',
          isGlass: false,
          photoData: img,
          faceHight: parseInt(faceIdTop),
          faceWidth: parseInt(faceIdWidth),
          faceX: faceX,
          faceY: faceY,
        },
        {
          seqNo: '2',
          isGlass: false,
          photoData: img2,
          faceHight: parseInt(faceIdTop),
          faceWidth: parseInt(faceIdWidth),
          faceX: faceX,
          faceY: faceY,
        }],
      }
    }

    console.log('payload : ', payload);

    axios.post(`${API_URL}/v1/fileTrans`, payload)
      .then((res) => {
        if (res.data.result === 'true') {
          setStep(3);
        } else {
          setStep(3);
        }
      })
  };


  const reopenCamera = (captureIdx) => {
    captureIdxRef.current = captureIdx;
    setStep(1);
  };

  useEffect(() => {
    if (step === 1) {
      const stepData = {
        step_idx: data.step_idx,
      }

      console.log(stepData);

      axios.post(`${API_URL}/v1/info/pictureEntered`, stepData)
        .then(res => console.log(res.data))
        .catch(err => console.log(err));

      setWebFace([]);
      runFacemesh();
    }

    if (step === 2) {
      const _w = window.innerWidth;
      const _h = window.innerHeight;
      const canvas = document.createElement("canvas");
      canvas.width = 200;
      canvas.height = 300;
      const ctx = canvas.getContext("2d");
      const imageObj = new Image();

      imageObj.onload = function () {
        const sx = 0; //-40
        //const sy = (500 - 480) / 2;
        const sy = 0; //-15
        //캔버스의 크기
        const sw = 2000; //800
        const sh = 2000; //800
        const dx = 0;
        const dy = 0;
        //안에 들어오는 이미지의 크기
        const dw = 1000; //1000 670
        const dh = 1000; //1000

        ctx.drawImage(imageObj, sx, sy, sw, sh, dx, dy, dw, dh);
        // ctx.drawImage(imageObj, sx, sy, sw, sh, dx, dy);
        const _imgList = JSON.parse(JSON.stringify(imgList));

        _imgList[captureIdxRef.current] = {
          ...imgList[captureIdxRef.current],
          croped: canvas.toDataURL(),
        };

        console.log('_imgList croped', _imgList);

        setImgList(_imgList);
      };

      imageObj.src = imgList[captureIdxRef.current].src;
    }

  }, [step]);


  useEffect(() => {
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener('popstate', function (event) { window.history.pushState(null, document.title, window.location.href); });
  }, [window.location.href]);

  const cameraButton = () => {
    alert('카메라 사용허가를 거부하면 촬영이 진행되지 않습니다.');
  }

  function close() {
    setTimeout(() => {
      window.location.href = 'https://www.s1.co.kr/';
    }, 2000)
  };
  return (
    <>
      {step === 0 && (
        <div className={style.container} style={{ paddingTop: '10%' }}>

          <Box step={4} text1="이렇게 하면" text2="얼굴인식이 잘 돼요" />
          <div>
            <CheckTextFields />
          </div>

          <form className={style.mainForm} style={{bottom:0, marginTop:'20%'}}>
            <SubmitButton
              type="button"
              label={"촬영하기"}
              onClick={() => {
                setOpen(!open);
              }}
            />
          </form>

          {
            open === true
              ? <CameraModal open={open} Disagree={setOpen} setStep={setStep} text1={'카메라 권한 거부 시'} text2={'사진 촬영이 불가합니다'} />
              : null
          }
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
            {cameraButton}
          </div>
          <div className={style.coverDiv}>

            <div className={style.drowingContainer}>
              <div className={style.drowingContainer2}>
                <WrieframeSvg className={style.wireframeIcon} />
              </div>
            </div>

            <div className={style.webcamContainer}>
              {detected === true
                ?
                <canvas
                  ref={canvasRef}
                  className={style.camera}
                  style={{ position: "absolute", zIndex: 3, border: "4px solid blue" }}
                ></canvas>
                :
                <canvas
                  ref={canvasRef}
                  className={style.camera}
                  style={{ position: "absolute", zIndex: 3, border: "3px solid red" }}
                ></canvas>
              }
              <Webcam
                ref={webcamRef}
                videoConstraints={videoConstraints}
                mirrored={true}
                className={style.camera}
                screenshotFormat="image/jpeg"
                height={480}
                width={640}
              />
            </div>

            {detected === true
              ? <div className={style.webcamInfoText}>
                <span style={{textAlign:'left',marginLeft:"-18px"}}>정면을 계속 응시해주세요</span>
                <ProgressCircle
                  capturePlay={capturePlay}
                  onComplete={handleCaptureComplete}
                  detected={detected}
                  setDetected={setDetected}
                />
              </div>
              : <div className={style.webcamInfoText}>
                <span style={{textAlign:'left', margin:"0 0 0 10px"}}>눈썹, 눈, 코, 입이 잘 보이도록 안내선에 <br /> 맞춰 촬영해주세요</span>
                <ProgressCircle
                  capturePlay={capturePlay}
                  onComplete={handleCaptureComplete}
                />
              </div>}

          </div>
        </div>
      )}

      {step === 2 && (
        <div className={style.container} style={{ paddingTop: '5%' }}>
          {data?.isGlass && imgList.length < 4 && (
            <Box step={5} text1="안경을 벗고" text2="한번 더 찍어주세요" />
          )}
          {((data?.isGlass && imgList.length === 4) ||
            (!data?.isGlass && imgList.length === 3)) && (
              <Box step={5} text1="사진이 잘 찍혔는지" text2="확인해주세요" />
            )}
          <div className={style.group17}></div>


          {!data?.isGlass && imgList[0]?.croped && (
            <div className={style.confirmImageContainer} style={{ textAlign: 'center' }}>
              <img src={imgList[0].croped} className={style.singleImage} />
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

                        <img src={cameraPng} className={style.cameraImage} style={{}} />
                        다시찍기
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          <div style={{ justifyContent: 'center' }}>
            <div className={style.cameraButtonsContainer}>
              <button
                onClick={cancel}
                className={style.cameraCancelButton}
                style={{ marginRight: '1%' }}
              >
                등록 취소
                { }
              </button>
              <button
                onClick={submit}
                className={style.cameraSubmitButton}
                style={{ marginLeft: '1%' }}
                disabled={
                  data.isGlass ? imgList.length !== 4 : imgList.length !== 3
                }
              >
                사진 등록
              </button>
            </div>
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
            {close()}
          </div>
        </>
      )}
    </>
  );
}

const CameraModal = ({ text1, text2, Disagree, open, setStep }) => {
  return (
    <div className={style.Modal} >
      <div className={style.ModalWrapper}>
        <div className={style.ModalTextWrapper}>
          <p style={{ margin: 'auto' }}>{text1}</p>
          <p style={{ margin: 'auto' }}>{text2}</p>
        </div>
        <div className={style.ButtonWrapper}>
          <button className={style.usefulModalButton} onClick={() => { Disagree(!open); setStep(1) }} >촬영하기</button>
        </div>
      </div>
    </div>
  )
}
export default Camera;