import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import SubmitButton from "../Component/SubmitButton";
import utils from "../utils";
import style from "../Css/Main.module.css";
import {
  isMobile,
  BrowserView,
  MobileView,
  isBrowser
} from 'react-device-detect';
import qs from "qs";
import axios from 'axios';

import passImg1 from "../assets/passImg1.jpeg";
import passImg2 from "../assets/passImg2.jpeg";
import passImg3 from "../assets/passImg3.jpeg";
import { PREFIX, API_URL } from "../config";

function Intro() {
  const history = useHistory();
  const [step, setStep] = useState(0);
  const [workplace, setWorkplace] = useState();
  const [encData, setEncData] = useState();

  const fRef = useRef();

  const handleClick = (e) => {
    const _data = {
      workplace: workplace, // QR에서 받아옴
      name: "", //  패스인증
      tel: "", // 패스인증
    };

    history.push(`${PREFIX}/info?q=${utils.encode(JSON.stringify(_data))}`);
  };

  useEffect(() => {
    if(!isMobile) history.push("/weberrorpage");

    const { workplace } = qs.parse(window.location.search.slice(1));

    const payload = {
      uuid :workplace || null
    }

    axios.post(`${API_URL}/v1/siteInfo`, payload)
    .then((res) => {
      if(res.data === null || res.data.result === '잘못된 요청입니다.') {
  
      }
      console.log("intro.js::::");
      
      setWorkplace(res.data)
      
      axios({
        method: 'POST',
        //url: 'http://121.165.242.171:9998/checkplus_json',
        url: `${API_URL}/v1/niceApiCodeController`,
        timeout: 5000
      }).then((res) => {
        localStorage.setItem('workplace', JSON.stringify(workplace));
        console.log(workplace);
        console.log(res);
        setEncData(res.data.enc_data);
      }).catch(() => {
        // window.location.reload();
      });

    })
    .catch((err) => {
      // history.push("/errorpage")
    })
  }, [])

  return (
  <MobileView>
    <div>
      <form ref={fRef} action="https://nice.checkplus.co.kr/CheckPlusSafeModel/checkplus.cb">
        <input type="hidden" name="m" value="checkplusSerivce" />
        <input type="hidden" name="EncodeData" value={encData} />
      </form>
      <h1 className={style.title}>MFR System</h1>
      {step === 0 && (
        <SubmitButton
          type="button"
          onClick={() => {
            fRef.current.submit()
            // setStep(1);
          }}
          label={"인증하기"}
        />
      )}
      {step === 1 && (
        <img
          src={passImg3}
          onClick={() => {
            setStep(2);
          }}
          style={{
            position: "absolute",
            top: 0,
            width: "100vw",
            // height: "100vh",
          }}
        />
      )}
      {step === 2 && (
        <img
          src={passImg1}
          onClick={() => {
            setStep(3);
          }}
          style={{
            position: "absolute",
            top: 0,
            width: "100vw",
            //height: "100vh",
          }}
        />
      )}
      {step === 3 && (
        <img
          src={passImg2}
          onClick={handleClick}
          style={{
            position: "absolute",
            top: 0,
            width: "100vw",
            //height: "100vh",
          }}
        />
      )}
    </div>
  </MobileView>
  );
}

export default Intro;
