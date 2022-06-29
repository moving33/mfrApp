import React, { useRef, useState, useEffect } from "react";
import { ReactComponent as WrieframeSvg } from "../assets/wireframe.svg";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import LoadingPaper from "../Component/loadingPage/LoadingPaper";
import CheckTextFields from "../Component/CheckTextFields";
import * as blazeface from "@tensorflow-models/blazeface";
import ProgressCircle from "../Component/ProgressCircle";
import { encrypt } from "../config/encOrdec";
import SubmitButton from "../Component/SubmitButton";
import cameraPng from "../assets/camera.png";
import { API_URL } from "../config";
import style from "../Css/Main.module.css";
import closePng from "../assets/close.png";
import NoImage from "../Component/NoImage";
import { tokenSaver } from "../atom/index";
import { useRecoilState } from "recoil";
import Box from "../Component/Box";
import Webcam from "react-webcam";
import utils from "../utils";
import axios from "axios";
import qs from "qs";

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: "user",
};

function Camera() {
  const [ready, setReady] = useState(false);
  const webcamRef = useRef(null);
  const intervalIdRef = useRef(null);
  const canvasRef = useRef();
  //얼굴의 랜드마크로 가로값 세로값 계산
  const [faceX, setFaceX] = useState();
  const [faceY, setFaceY] = useState();
  const [faceIdWidth, setFaceWidth] = useState();
  const [faceIdTop, setFaceIdTop] = useState();
  //전페이지에서 날라온 데이터
  const [data, setData] = useState();
  //촤영된 사진의 리스트
  const [imgList, setImgList] = useState([]);
  const [webFace, setWebFace] = useState([]);
  //얼굴이 들어왔는지
  const [detected, setDetected] = useState(false);
  const [captured, setCaptured] = useState(false);
  //카메라 ref
  const captureIdxRef = useRef(0);
  //컴포넌트 페이지 단계
  const [step, setStep] = useState(0); // 0: 확인메시지창, 1: 카메라 화면, 2. 확인 화면, 3. 결과 화면
  //사진 촬영시작 유무
  const [capturePlay, setCapturePlay] = useState(false);
  //모달 오픈
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [imgW, setImgW] = useState();
  const [imgP, setImgP] = useState();
  const [noImageHight, setNoImageHight] = useState();
  const [noImageWidth, setNoImageWidth] = useState();
  const [userOS, setUserOS] = useState();
  const progressRef = useRef(null);

  const [token, setToken] = useRecoilState(tokenSaver);

  const fullScreen = useFullScreenHandle();

  useEffect(() => {
    //userAgent 값 얻기
    var varUA = navigator.userAgent.toLowerCase();
    //안드로이드일 경우 안드로이드로 설정
    if (varUA.indexOf("android") > -1) {
      setUserOS("A");
      return userOS;
      //아이폰 아이팟 아이패드일 경우 IOS로 설정
    } else if (
      varUA.indexOf("iphone") > -1 ||
      varUA.indexOf("ipad") > -1 ||
      varUA.indexOf("ipod") > -1
    ) {
      setUserOS("I");
      return userOS;
      //그외의 경우
    } else {
      setUserOS("Oß");
      return "other";
    }
  });

  useEffect(() => {
    //넘어온 데이터
    const { q } = qs.parse(window.location.search.slice(1));
    //데이터 복호화
    const _data = JSON.parse(utils.decode(q));
    //data 에 _data 대입
    setData(_data);
    //페이지가 끝나게 되면 실해하는 로직
    return () => {
      //intervalIdRef의 종료
      clearInterval(intervalIdRef.current);
    };
  }, []);

  const capture = () => {
    //captured에값을 true로 변경
    setCaptured(true);
    //capturePlay에값을 true로 변경
    setCapturePlay(true);
  };

  useEffect(() => {
    //스탭값이 2가 되면 실행한다
    if (step === 2) {
      //noIMGH에 twoImg의 offsetHeight를 대입한다
      let noIMGH = document?.getElementById("twoImg")?.offsetHeight;
      //noIMGW에 twoImg의 offsetWidth를 대입한다
      let noIMGW = document?.getElementById("twoImg")?.offsetWidth;
      //NoImageHight에 noIMGH을 대입한다
      setNoImageHight(noIMGH);
      //NoImageWidth에 noIMGW을 대입한다
      setNoImageWidth(noIMGW);
    }
  }, [imgList]);

  useEffect(() => {
    //네이게이처에서 미디어 디바이스 오브젝트를 불러온다
    navigator.mediaDevices
      //미디어 오브젝트의 유저 미디어를 가져오는 함수를 작동한다
      .getUserMedia({ video: true })
      //성공하면 넘어간다
      .then(() => {})
      //실패시 콘솔에 에러가 찍힌다
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const _imgList = JSON.parse(JSON.stringify(imgList));

  const handleCaptureComplete = async (detected, step) => {
    //얼굴이 인식되면 setReady, setDetected, setCaptured, setCapturePlay 값이 모두 false로 바뀐다
    if (detected) {
      setReady(false);
      setDetected(false);
      setCaptured(false);
      setCapturePlay(false);
      //인식이 풀리면 함수가 끝이난다
      if (!webcamRef.current || !detected) {
        return;
      }
      //첫번째 사진이 촬영된다
      const imageSrc = webcamRef.current.getScreenshot({
        width: imgW,
        height: 512,
      });
      //사진 배열 안에 넣기
      _imgList[captureIdxRef.current] = { src: imageSrc };
      //100ms의 텀을 두고 함수가 실행된다
      setTimeout(() => {
        //두번째 사진이 촬영된다
        const imageSrc2 = webcamRef.current.getScreenshot({
          width: imgW,
          height: 512,
        });
        //사진 배열 안에 넣기
        _imgList[captureIdxRef.current + 2] = { src: imageSrc2 };
        //사진이 들어간 배열을 imgList에 대입한다
        setImgList(_imgList);
        //함수 종료
        clearInterval(intervalIdRef.current);
        //안드로이드의 경우 전체화면도 종료
        if (userOS === "A") fullScreen.exit();
        //다음단계로 넘어간다
        setStep(2);
      }, 100);
    } else {
      //얼굴이 인식되지 않았을 경우
      setReady(false);
      setDetected(false);
      setCaptured(false);
      setCapturePlay(false);
      return;
    }
  };

  const runFacemesh = async () => {
    //blazeface.load()실행값을 load안에 넣어준다
    const net = await blazeface.load();
    //500ms뒤 detect함수를 net을 매게변수로 실행시킨다
    intervalIdRef.current = setInterval(() => {
      detect(net);
    }, 500);
  };

  const detect = async (net) => {
    //캔버스의 정보를 가져온다
    let element = document.getElementById("cameraCanvas");
    //512에 맞춰진 세로값의 비율을 구한다
    let _h = 512 / element?.clientHeight;
    //구해진 비율에 가로값을 곱해 계산한다
    let _w = _h * window.innerWidth;
    //세로값을 이미지에 대입한다
    setImgP(_h);
    //가로값을 이미지에 대입한다
    setImgW(_w);
    //만약 webcam커렌트의 값이 undefined거나 null이거나 readyState가 4이면 실행한다
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      //webcamRef비디오의 값을 빼내어 온다
      const video = webcamRef.current.video;
      //비디오의 가로 값을 빼내어 온다
      const videoWidth = webcamRef.current.video.videoWidth;
      //비디오의 세로 값을 빼내어 온다
      const videoHeight = webcamRef.current.video.videoHeight;
      //webcamRef의 가로 값에 videoWidth를 대입한다
      webcamRef.current.video.width = videoWidth;
      //webcamRef의 세로 값에 videoWidth를 대입한다
      webcamRef.current.video.height = videoHeight;

      //blazeface.load()에 estimateFaces함수를 비디오를 매게 변수로 실행시킨다
      const _webFace = await net.estimateFaces(video);
      //_webFace의 길이가 1이라면
      if (_webFace.length === 1) {
        //얼굴의 상단 왼쪽, 오른쪽아래, 눈코입의 위치를 가져온다
        const { topLeft, bottomRight, landmarks } = _webFace[0];
        //얼굴이 인식되는 영역안에 들어오면 함수가 실행된다
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
          //얼굴의 세로 값을 계산하여 넣어준다
          setFaceIdTop(bottomRight[1] - topLeft[1]);
          //얼굴의 가로값을 계산하여 넣어준다
          setFaceWidth(landmarks[5][0] - landmarks[4][0]);
          //얼굴의 Y값
          setFaceY(topLeft);
          //얼굴의 X값
          setFaceX(bottomRight);
          //인식은 truie가 된다
          setDetected(true);
          //captured 가 true면 실헹한다
          if (!captured) {
            //얼굴 사진 촬영에 들어간다
            setWebFace(_webFace);
            capture();
          }
        } else {
          //인식이 풀린다
          setDetected(false);
        }
      }
    }
  };

  const closeCam = () => {
    if (userOS === "A") fullScreen?.exit();
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
    //배열의 위치 값 0으로 설정
    captureIdxRef.current = 0;
    //촬영된 이미지 삭제
    setImgList([]);
    //카메라의 초기 화면으로 되돌린다
    setStep(0);
  };

  const submit = () => {
    //사진이 서버로 넘어가기 전까지 로딩 화면이 나온다
    setLoading(true);
    //빈 객체하나를 생성한다
    let payload = {};
    //이미지가 4장일 경우에 실행되는 로직
    if (imgList.length === 4) {
      //이미지의 값을 각자 뽑아와 준다
      const img = imgList[0].src.split(",")[1];
      const img2 = imgList[1].src.split(",")[1];
      const img3 = imgList[2].src.split(",")[1];
      const img4 = imgList[3].src.split(",")[1];
      //서버로 보낼 데이터를 정리해 준다
      payload = {
        //진행상태
        step_idx: data.step_idx,
        //클래스 아이디
        classId: data.class_id,
        //사번
        bussiId: data.emNum,
        //안경착용 유무
        phtoCnt: data.isGlass ? "2" : "1",
        //사진들
        photos: [
          {
            seqNo: "1",
            isGlass: false,
            photoData: img,
            faceHight: parseInt(faceIdTop),
            faceWidth: parseInt(faceIdWidth),
            faceX: faceX,
            faceY: faceY,
          },
          {
            seqNo: "2",
            isGlass: true,
            photoData: img2,
            faceHight: parseInt(faceIdTop),
            faceWidth: parseInt(faceIdWidth),
            faceX: faceX,
            faceY: faceY,
          },
          {
            seqNo: "3",
            isGlass: true,
            photoData: img3,
            faceHight: parseInt(faceIdTop),
            faceWidth: parseInt(faceIdWidth),
            faceX: faceX,
            faceY: faceY,
          },
          {
            seqNo: "4",
            isGlass: true,
            photoData: img4,
            faceHight: parseInt(faceIdTop),
            faceWidth: parseInt(faceIdWidth),
            faceX: faceX,
            faceY: faceY,
          },
        ],
      };
    }
    //배열의 길이가 3일 떄 실행
    if (imgList.length === 3) {
      //이미지의 값을 각자 뽑아와 준다
      const img = imgList[0].src.split(",")[1];
      const img2 = imgList[2].src.split(",")[1];

      payload = {
        //진행상태
        step_idx: data.step_idx,
        //클래스 아이디
        classId: data.class_id,
        //사번
        bussiId: data.emNum,
        //안경 착용 유무
        phtoCnt: data.isGlass ? "2" : "1",
        //이미지 상태
        photos: [
          {
            seqNo: "1",
            isGlass: false,
            photoData: img,
            faceHight: parseInt(faceIdTop),
            faceWidth: parseInt(faceIdWidth),
            faceX: faceX,
            faceY: faceY,
          },
          {
            seqNo: "2",
            isGlass: false,
            photoData: img2,
            faceHight: parseInt(faceIdTop),
            faceWidth: parseInt(faceIdWidth),
            faceX: faceX,
            faceY: faceY,
          },
        ],
      };
    }
    //데이터들을 제이슨화
    const jsonUserInfo = JSON.stringify(payload);
    //제이슨된 데이터를 암호화
    const jsonEncUserInfo = encrypt(jsonUserInfo);
    //암호화된 데이터를 오브젝트화
    const sendUserInfo = { data: jsonEncUserInfo || null };

    axios
      .post(`${API_URL}/v1/fileTrans`, sendUserInfo, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.status === 200) {
          //성공하면 로딩이 끝나고 다음페이지로 넘어간다
          setLoading(false);
          setStep(3);
        } else {
          //실패해도 넘어간다
          setLoading(false);
          setStep(3);
        }
      })
      //에러가 났을 경우 로직
      .catch((err) => {
        if (err.response.status === 401) {
          alert("유효하지 않은 접근입니다.");
          window.location.href = "https://www.s1.co.kr/";
        } else {
          alert(
            `오류로 인해 요청을 완료할 수 없습니다.나중에 다시 시도하십시오.`
          );
          window.location.href = "https://www.s1.co.kr/";
        }
      });
  };

  const reopenCamera = (captureIdx) => {
    //이미지 배열의 값을 기존의 값으로 조절
    captureIdxRef.current = captureIdx;
    //사진 촬영으로 들어가면서 안드로이드면 전체화면으로 전환
    setTimeout(() => {
      if (userOS === "A") fullScreen.enter();
      setStep(1);
    }, 100);
  };

  useEffect(() => {
    //페이지 로드시 화면을 최상단으로 가게 해준다
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    //step값이 1일때 실행
    if (step === 1) {
      //stepData을 생성하고 값으로 step_idx: data.step_idx을 넣어준다
      const stepData = {
        step_idx: data.step_idx,
      };
      //토큰을 실고 정당한 사용자인지 확인한다
      axios
        .post(`${API_URL}/v1/info/pictureEntered`, stepData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log(res.status);
        })
        //아닐경우 에러페이지로 이동
        .catch((err) => {
          if (err?.response?.status === 401) {
            alert("유효하지 않은 접근입니다.");
            window.location.href = "https://www.s1.co.kr/";
          } else {
            alert(
              `오류로 인해 요청을 완료할 수 없습니다.나중에 다시 시도하십시오.`
            );
            window.location.href = "https://www.s1.co.kr/";
          }
        });
      //맞을 경우 사진촬영 대기 상태에 진입한다
      setWebFace([]);
      runFacemesh();
    }
    //step값이 2일 경우 실행
    if (step === 2) {
      //canvas의 정보를 가져온다
      const canvas = document.createElement("canvas");
      //canvas의 가로 값을 imgW 에 맞춘다
      canvas.width = imgW;
      //canvas의 세로 값을 imgW 에 맞춘다
      canvas.height = imgW;
      //화면에 보이지 않는 2d 캔버스을 만들어준다
      const ctx = canvas.getContext("2d");
      //이미지 객체를 하나 생성해 준다
      const imageObj = new Image();
      //이미지를 캔버스 위에 그려 화면에 뿌려준다
      imageObj.onload = function () {
        //이미지 시작 위치값 상단 왼쪽 끝
        const sx = 0;
        const sy = 0;
        //이미지가 대입되는 함수
        ctx.drawImage(imageObj, sx, sy);
        const _imgList = JSON.parse(JSON.stringify(imgList));
        //1번째와 2번쨰 이미지가 화면에 나타나게 된다.
        _imgList[captureIdxRef.current] = {
          ...imgList[captureIdxRef.current],
          croped: canvas.toDataURL(),
        };

        setImgList(_imgList);
      };

      imageObj.src = imgList[captureIdxRef.current]?.src;
    }
  }, [step]);

  useEffect(() => {
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener("popstate", function (event) {
      window.history.pushState(null, document.title, window.location.href);
    });
  }, [window.location.href]);

  const cameraButton = () => {
    alert("카메라 사용허가를 거부하면 촬영이 진행되지 않습니다.");
  };

  function close() {
    //2초뒤 에스원 메인화면으로 이동
    setTimeout(() => {
      window.location.href = "https://www.s1.co.kr/";
    }, 2000);
  }
  return (
    <div className={style.body}>
      {step === 0 && (
        <div className={style.container}>
          <Box step={4} text1="이렇게 하면" text2="얼굴인식이 잘 돼요" />
          <div className={style.cameraFiled}>
            <CheckTextFields />
          </div>

          <form className={style.mainForm} style={{ bottom: 0 }}>
            <SubmitButton
              type="button"
              label={"촬영하기"}
              onClick={() => {
                setOpen(!open);
              }}
            />
          </form>

          {open === true ? (
            <CameraModal
              open={open}
              Disagree={setOpen}
              fullScreen={fullScreen}
              setStep={setStep}
              text1={"카메라 권한 거부 시"}
              text2={"사진 촬영이 불가합니다"}
              text3={
                "본인 외 타인 얼굴, 사진을 도용하는 경우 법적 처벌 또는 소속회사의 제재를 받을 수 있습니다."
              }
              userOS={userOS}
            />
          ) : null}
        </div>
      )}

      {userOS === "A" ? (
        <FullScreen handle={fullScreen}>
          {step === 1 && (
            <div className={style.cameraBackground} id="cameraBack">
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
                  {detected === true ? (
                    <canvas
                      ref={canvasRef}
                      className={style.camera}
                      style={{
                        position: "absolute",
                        zIndex: 3,
                        border: "4px solid blue",
                      }}
                      id="cameraCanvas"
                    ></canvas>
                  ) : (
                    <canvas
                      ref={canvasRef}
                      className={style.camera}
                      style={{
                        position: "absolute",
                        zIndex: 3,
                        border: "3px solid red",
                      }}
                      id="cameraCanvas"
                    ></canvas>
                  )}
                  <Webcam
                    ref={webcamRef}
                    videoConstraints={videoConstraints}
                    mirrored={true}
                    className={style.camera}
                    screenshotFormat="image/jpeg"
                    width={480}
                    height={640}
                  />
                </div>

                {detected === true ? (
                  <div className={style.webcamInfoText}>
                    <span
                      style={{
                        textAlign: "left",
                        margin: "0 0 0 10px",
                        opacity: 3,
                      }}
                    >
                      정면을 계속 응시해주세요
                    </span>
                    <ProgressCircle
                      capturePlay={capturePlay}
                      onComplete={handleCaptureComplete}
                      detected={detected}
                      setDetected={setDetected}
                      step={step}
                    />
                  </div>
                ) : (
                  <div className={style.webcamInfoText}>
                    <span
                      style={{
                        textAlign: "left",
                        margin: "0 0 0 10px",
                        opacity: 3,
                      }}
                    >
                      눈썹, 눈, 코, 입이 잘 보이도록 안내선에 <br /> 맞춰
                      촬영해주세요
                    </span>
                    <ProgressCircle
                      capturePlay={capturePlay}
                      onComplete={handleCaptureComplete}
                      step={step}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </FullScreen>
      ) : (
        <>
          {step === 1 && (
            <div className={style.cameraBackground} id="cameraBack">
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
                  {detected === true ? (
                    <canvas
                      ref={canvasRef}
                      className={style.camera}
                      style={{
                        position: "absolute",
                        zIndex: 3,
                        border: "4px solid blue",
                      }}
                      id="cameraCanvas"
                    ></canvas>
                  ) : (
                    <canvas
                      ref={canvasRef}
                      className={style.camera}
                      style={{
                        position: "absolute",
                        zIndex: 3,
                        border: "3px solid red",
                      }}
                      id="cameraCanvas"
                    ></canvas>
                  )}
                  <Webcam
                    ref={webcamRef}
                    videoConstraints={videoConstraints}
                    mirrored={true}
                    className={style.camera}
                    screenshotFormat="image/jpeg"
                    width={480}
                    height={640}
                  />
                </div>

                {detected === true ? (
                  <div className={style.webcamInfoText}>
                    <span
                      style={{
                        textAlign: "left",
                        margin: "0 0 0 10px",
                        opacity: 3,
                      }}
                    >
                      정면을 계속 응시해주세요
                    </span>
                    <ProgressCircle
                      capturePlay={capturePlay}
                      onComplete={handleCaptureComplete}
                      detected={detected}
                      setDetected={setDetected}
                      step={step}
                    />
                  </div>
                ) : (
                  <div className={style.webcamInfoText}>
                    <span
                      style={{
                        textAlign: "left",
                        margin: "0 0 0 10px",
                        opacity: 3,
                      }}
                    >
                      눈썹, 눈, 코, 입이 잘 보이도록 안내선에 <br /> 맞춰
                      촬영해주세요
                    </span>
                    <ProgressCircle
                      capturePlay={capturePlay}
                      onComplete={handleCaptureComplete}
                      detected={detected}
                      step={step}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {step === 2 && (
        <div
          className={style.container}
          style={{ paddingTop: "5%", position: "relative", height: "90vh" }}
        >
          {data?.isGlass && imgList.length < 4 && (
            <Box step={5} text1="안경을 벗고" text2="한번 더 찍어주세요" />
          )}
          {((data?.isGlass && imgList.length === 4) ||
            (!data?.isGlass && imgList.length === 3)) && (
            <Box step={5} text1="사진이 잘 찍혔는지" text2="확인해주세요" />
          )}
          <div className={style.group17}></div>

          {!data?.isGlass && imgList[0]?.croped && (
            <div
              className={style.confirmImageContainer}
              style={{ textAlign: "center" }}
            >
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
                  <div
                    className={style.confirmImageContainer2}
                    style={{ marginRight: "1%" }}
                  >
                    {imgList[0]?.croped && (
                      <img
                        src={imgList[0]?.croped}
                        className={style.twoImage}
                        id="twoImg"
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

                  <div
                    className={style.confirmImageContainer2}
                    style={{ marginLeft: "1%" }}
                  >
                    {imgList[1]?.croped && (
                      <img
                        src={imgList[1]?.croped}
                        className={style.twoImage}
                      />
                    )}
                    {!imgList[1]?.croped && noImageHight && (
                      <NoImage
                        onClick={() => {
                          setTimeout(() => {
                            reopenCamera(1);
                          }, 100);
                        }}
                        height={noImageHight}
                      />
                    )}
                    {imgList[1]?.croped && (
                      <div
                        className={style.reopenCamera}
                        onClick={() => {
                          reopenCamera(1);
                        }}
                      >
                        <img
                          src={cameraPng}
                          className={style.cameraImage}
                          style={{}}
                        />
                        다시찍기
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          <div className={style.cameraButtonsContainer}>
            <button
              onClick={cancel}
              className={style.cameraCancelButton}
              style={{ marginRight: "1%" }}
            >
              등록 취소
              {}
            </button>
            <button
              onClick={submit}
              className={style.cameraSubmitButton}
              style={{ marginLeft: "1%" }}
              disabled={
                data.isGlass ? imgList.length !== 4 : imgList.length !== 3
              }
            >
              사진 등록
            </button>
          </div>
        </div>
      )}
      {loading && <LoadingPaper />}
      {step === 3 && (
        <>
          <div>
            <div className={style.errorBoxContainer}>
              <div className={style.inputInfo}>
                <p>얼굴등록이</p>
                <p>완료되었습니다</p>
              </div>
            </div>
            <div
              className={style.errorSubBoxContainer}
              style={{ marginTop: "-2%" }}
            >
              <p className="ErrorSubscript">
                출입등록이 가능해지면
                <br />
                문자로 알려 드릴게요!
              </p>
              {close()}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const CameraModal = ({
  text1,
  text2,
  text3,
  Disagree,
  open,
  setStep,
  fullScreen,
  userOS,
}) => {
  return (
    <div className={style.Modal}>
      <div className={style.ModalWrapper}>
        <div className={style.ModalTextWrapper}>
          <p style={{ margin: "auto" }}>{text1}</p>
          <p style={{ margin: "auto" }}>{text2}</p>
          <p
            style={{
              margin: 15,
              color: "red",
              fontSize: 13,
              textAlign: "center",
            }}
          >
            {text3}
          </p>
        </div>
        <div className={style.ButtonWrapper}>
          {userOS === "A" ? (
            <button
              className={style.usefulModalButton}
              onClick={() => {
                Disagree(!open);
                setStep(1);
                fullScreen.enter();
              }}
            >
              촬영하기
            </button>
          ) : (
            <button
              className={style.usefulModalButton}
              onClick={() => {
                Disagree(!open);
                setStep(1);
              }}
            >
              촬영하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default Camera;
