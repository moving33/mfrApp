import React, { useEffect, useRef, useState } from 'react';
import style from '../Css/Main.module.css';

import progressCircle0   from '../assets/progress-circle-0.png';
import progressCircle25  from '../assets/progress-circle-25.png';
import progressCircle50  from '../assets/progress-circle-50.png';
import progressCircle75  from '../assets/progress-circle-75.png';
import progressCircle100 from '../assets/progress-circle-100.png';

let _detacted = false;

const sleep = (ms) => {
  return new Promise((res, rej) => {
    let id;
    id = setTimeout(() => {
      res(id);
    }, ms);
  })
}

function ProgressCircle({ capturePlay, onComplete, detected, ref }) {
  const timeoutIds = useRef([]);
  const [timer, setTimer] = useState(0);


  useEffect(() => {
    if (capturePlay){
      // playCapture(timer);
    }
    return () => {
      // state.isOffedCamera = detected;
    }
  }, [capturePlay]);

  useEffect(() => {
    _detacted = detected;
    if(detected) {
      playCapture(timer);
    }
    return () => {
    };
  }, [detected])


  const playCapture = async (timer) => {

    if (!detected) {
      return;
    } 

      let _timer = timer;
      _timer += 25;
      console.log('state.isOffedCamera1',_detacted)
      if(_detacted === undefined){
        console.log('이거 나오면 카메라 멈추는거다.')
        setTimer(0)
        _timer = 0
        return;
      }
      timeoutIds.current.push(await sleep(4500 / 4));
      setTimer(_timer);
      _timer += 25;
      console.log('state.isOffedCamera2',_detacted)
      if(_detacted === undefined){
        console.log('이거 나오면 카메라 멈추는거다.')
        setTimer(0)
        _timer = 0
        return;
      }
      timeoutIds.current.push(await sleep(4500 / 4));
      setTimer(_timer);
      _timer += 25;
      console.log('state.isOffedCamera3',_detacted)
      if(_detacted === undefined){
        console.log('이거 나오면 카메라 멈추는거다.')
        setTimer(0)
        _timer = 0
        return;
      }
      timeoutIds.current.push(await sleep(4500 / 4));
      setTimer(_timer);
      _timer += 25;
      console.log('state.isOffedCamera4',_detacted)
      if(_detacted === undefined){
        console.log('이거 나오면 카메라 멈추는거다.')
        setTimer(0)
        _timer = 0
        return;
      }
      timeoutIds.current.push(await sleep(4500 / 4));
      setTimer(_timer);

      onComplete && onComplete(_detacted);
      setTimer(0);
  }

  useEffect(() => {
    return () => {
      for (const timeoutId of timeoutIds?.current) {
        // console.log(timeoutId);
        clearTimeout(timeoutId);
      }
    }
  }, []);

  return (
    <div>
      {timer === 0   && <img src={progressCircle0}   className={style.progressCircle} />}
      {timer === 25  && <img src={progressCircle25}  className={style.progressCircle} />}
      {timer === 50  && <img src={progressCircle50}  className={style.progressCircle} />}
      {timer === 75  && <img src={progressCircle75}  className={style.progressCircle} />}
      {timer === 100 && <img src={progressCircle100} className={style.progressCircle} />}
    </div>
  )
}

export default ProgressCircle;



