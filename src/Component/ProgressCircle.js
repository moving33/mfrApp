import React, { useEffect, useRef, useState } from "react";
import style from "../Css/Main.module.css";

import progressCircle0 from "../assets/progress-circle-0.png";
import progressCircle25 from "../assets/progress-circle-25.png";
import progressCircle50 from "../assets/progress-circle-50.png";
import progressCircle75 from "../assets/progress-circle-75.png";
import progressCircle100 from "../assets/progress-circle-100.png";

//변수 _detacted를 선언하고 초기값은 false
let _detacted = false;
//함수 매게변수 ms를 받는 sleep를 선언
const sleep = (ms) => {
  //이 함수는 프로미스를 반환
  return new Promise((res, rej) => {
    //변수 id를 선언
    let id;
    //setTimeout의 아이디를 가져온다
    id = setTimeout(() => {
      //id를 콜백
      res(id);
      //매게변수 ms의 값마다 실행한다
    }, ms);
  });
};

//props로 capturePlay, onComplete, detected, ref를 받는 Functional Component ProgressCircle를 선언
function ProgressCircle({ capturePlay, onComplete, detected, ref }) {
  //배열인 timeoutIds 레퍼런스를 생성한다
  const timeoutIds = useRef([]);
  //값이 timer이고 timer의 값을 변경할 수 있는 함수 setTimer를 생성한다.
  const [timer, setTimer] = useState(0);

  // useEffect(() => {
  //   if (capturePlay) {
  //     playCapture(timer);
  //   }
  //   return () => {
  //     state.isOffedCamera = detected;
  //   };
  // }, [capturePlay]);

  //컴포넌트가 실행되자마자 같이 실행되는 함수
  useEffect(() => {
    //_detacted에 props로 받은 detected를 대입한다.
    _detacted = detected;
    //디텍팅이 된 상태라면 playCapture함수를 실행시킨다.
    if (detected) {
      playCapture(timer);
    }
    return () => {};
    //detected의 값이 변경 될때마다 함수를 실행한다.
  }, [detected]);

  //timer를 매게변수로 받는 playCaoture함수를 선언
  const playCapture = async (timer) => {
    //디텍팅이 되지 않았으면 함수를 실행하지 않는다.
    if (!detected) {
      return;
    }
    //타이머를 선언하고 값은 매게변수 타이머를 대입한다
    let _timer = timer;
    //_timer 기존값에 25를 더한다
    _timer += 25;
    //_detacted가 undefined되면 즉 디텍팅이 풀리면 함수를 종료하고 값을 전부 0으로 변경한다.
    if (_detacted === undefined) {
      setTimer(0);
      _timer = 0;
      return;
    }
    //디텍팅이 유지되면 레퍼런스 값에 sleep함수에 4.5초를 4로 나눈 값을 배열 뒤쪽에 추가한다.
    timeoutIds.current.push(await sleep(4500 / 4));
    //timer값에 _timer 넣어준다
    setTimer(_timer);
    //_timer 기존값에 25를 더한다
    _timer += 25;
    //_detacted가 undefined되면 즉 디텍팅이 풀리면 함수를 종료하고 값을 전부 0으로 변경한다.
    if (_detacted === undefined) {
      setTimer(0);
      _timer = 0;
      return;
    }
    timeoutIds.current.push(await sleep(4500 / 4));
    setTimer(_timer);
    _timer += 25;
    if (_detacted === undefined) {
      setTimer(0);
      _timer = 0;
      return;
    }
    timeoutIds.current.push(await sleep(4500 / 4));
    setTimer(_timer);
    _timer += 25;
    if (_detacted === undefined) {
      setTimer(0);
      _timer = 0;
      return;
    }
    timeoutIds.current.push(await sleep(4500 / 4));
    setTimer(_timer);

    //위의 과정을 4.5초간 즉 디텍팅이 된 상태로 4.5초가 지나면 onComplete를 실행시켜 사진을 촬영하고 타이머를 0으로 초기화 한다.
    onComplete && onComplete(_detacted);
    setTimer(0);
  };

  useEffect(() => {
    return () => {
      for (const timeoutId of timeoutIds?.current) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <div>
      {timer === 0 && (
        <img src={progressCircle0} className={style.progressCircle} />
      )}
      {timer === 25 && (
        <img src={progressCircle25} className={style.progressCircle} />
      )}
      {timer === 50 && (
        <img src={progressCircle50} className={style.progressCircle} />
      )}
      {timer === 75 && (
        <img src={progressCircle75} className={style.progressCircle} />
      )}
      {timer === 100 && (
        <img src={progressCircle100} className={style.progressCircle} />
      )}
    </div>
  );
}

export default ProgressCircle;
