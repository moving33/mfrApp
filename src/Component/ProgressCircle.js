import React, { useEffect, useRef, useState } from 'react';
import style from '../Css/Main.module.css';

import progressCircle0 from '../assets/progress-circle-0.png';
import progressCircle25 from '../assets/progress-circle-25.png';
import progressCircle50 from '../assets/progress-circle-50.png';
import progressCircle75 from '../assets/progress-circle-75.png';
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

function ProgressCircle({capturePlay, onComplete, detected}) {
  const timeoutIds = useRef([]);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if(capturePlay) {
      playCapture(timer);
    }
  }, [capturePlay]);


  useEffect(() => {
    // console.log("detecting",detected)
    _detacted = detected;
  }, [detected])


  const playCapture = async (timer) => {
    if (!detected) {
    }
    let _timer = timer;
    _timer += 25;
    timeoutIds.current.push(await sleep(4500 / 4));
    setTimer(_timer);
    _timer += 25;
    timeoutIds.current.push(await sleep(4500 / 4));
    setTimer(_timer);
    _timer += 25;
    timeoutIds.current.push(await sleep(4500 / 4));
    setTimer(_timer);
    _timer += 25;
    timeoutIds.current.push(await sleep(4500 / 4));
    setTimer(_timer);
    onComplete && onComplete(_detacted);
    setTimer(0);
  }

  useEffect(() => {
    return () => {
      for(const timeoutId of timeoutIds?.current) {
        console.log(timeoutId);
        clearTimeout(timeoutId);
      }
    }
  }, []);

  return (
      <div>
        {timer === 0 && <img src={progressCircle0} className={style.progressCircle}/>}
        {timer === 25 && <img src={progressCircle25} className={style.progressCircle}/>}
        {timer === 50 && <img src={progressCircle50} className={style.progressCircle}/>}
        {timer === 75 && <img src={progressCircle75} className={style.progressCircle}/>}
        {timer === 100 && <img src={progressCircle100} className={style.progressCircle}/>}
      </div>
  )
}

export default ProgressCircle;