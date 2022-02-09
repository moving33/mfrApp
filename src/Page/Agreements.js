import React, { useState, useEffect } from "react";
import style from "../Css/Main.module.css";
import Box from "../Component/Box";
import SubmitButton from "../Component/SubmitButton";
import ReactModal from 'react-modal'
import qs from "qs";
import utils from "../utils";
import AgreementsModal from "../Component/AgreementsModal";
import { useHistory } from "react-router";
import { PREFIX, API_URL } from "../config";
import axios from "axios";

const Agreements = () => {

  const [open, setOpen] = useState(false);
  const [checkedInputs, setCheckedInputs] = useState([]);
  const [sendData, setSendDate] = useState([]);
  const [sendData1, setSendDate1] = useState([]);
  const history = useHistory();

  const changeHandler = (checked, id) => {
    if (checked) {
      setCheckedInputs([...checkedInputs, id]);
      console.log(checkedInputs);
    } else {
      setCheckedInputs(checkedInputs.filter(el => el !== id));
    }
  };

  const changeHandler1 = (checked, id) => {
    if (checked) {
      setCheckedInputs([...checkedInputs, id]);
      console.log(checkedInputs);
    } else {
      setCheckedInputs(checkedInputs.filter(el => el !== id));
    }
  };

  useEffect(() => {
    const fetchAgreement = async () => {
      const { data } = await axios.post(`${API_URL}/v1/codeTextApi`)
      console.log(data)
      setSendDate1(data)
    }
    fetchAgreement();

    const { q } = qs.parse(window.location.search.slice(1));
    setSendDate(JSON.parse(utils.decode(q)))
    console.log(q);
  }, []);

  useEffect(() => {
    console.log(checkedInputs)
  }, [checkedInputs])

  const handleClick = () => {

    if (!(checkedInputs.includes('check',))) {
      alert('필수 선택에 동의해 주셔야 합니다.');
      return;
    }

    setOpen(!open);
    // const { q } = qs.parse(window.location.search.slice(1));
    // console.log(q);
    // console.log(sendData); // 전 페이지에서 넘어온 정보들 
    // const _data = JSON.parse(utils.decode(q));
    // _data.agree = true;

    // let payload = {
    //   site_manage_phone: sendData.tel,
    //   site_manage_name: sendData.name,
    //   site_idx: sendData.site_idx,
    //   step_idx: sendData.step_idx
    // };

    // console.log(payload);
    // axios.post(`${API_URL}/v1/info/personalAcceptData`, payload)
    //   .then((res) => {
    //     if (res.data.result === 'true') {
    //       history.replace(`${PREFIX}/select?q=${utils.encode(JSON.stringify(_data))}`);
    //     } else {
    //       history.replace('/Errorpage');
    //     }
    //   })
  };

  const nextBtn = () => {
    const { q } = qs.parse(window.location.search.slice(1));
    console.log(q);
    console.log(sendData); // 전 페이지에서 넘어온 정보들 
    const _data = JSON.parse(utils.decode(q));
    console.log("_data :", _data);
    _data.agree = true;

    let payload = {
      site_manage_phone: sendData.tel,
      site_manage_name: sendData.name,
      site_idx: sendData.site_idx,
      step_idx: sendData.step_idx,
    };

    console.log(payload);
    axios.post(`${API_URL}/v1/info/personalAcceptData`, payload)
      .then((res) => {
        if (res.data.result === 'true') {
          history.replace(`${PREFIX}/select?q=${utils.encode(JSON.stringify(_data))}`);
        } else {
          history.replace('/Errorpage');
        }
      })
  }

  useEffect(() => {
    console.log(window.history.state)
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener('popstate', function (event) { window.history.pushState(null, document.title, window.location.href); });
  }, [window.location.href]);

  return (
    <div className={style.container}>
      <Box step={2} text1="개인정보" text2="수집/이용 동의" />
      <div className={style.group17}></div>
      <div className={style.agree}>
        <input id="check" type="checkbox" style={{ marginRight: "10px" }}
          onChange={(e) => {
            if (checkedInputs.length === 0) {
              setCheckedInputs(['check', 'check2']);
            } else if (checkedInputs.length === 1) {
              setCheckedInputs(['check', 'check2']);
            } else {
              setCheckedInputs([]);
            }
          }}
          checked={checkedInputs.length === 2}
        ></input>

        <div className={style.borderBtm}>전체 동의하기</div>
      </div>
      <div className={style.contentWrapper}>
        <div className={style.secondCheck}>
          <input label="check" type="checkbox" style={{ marginRight: '10px' }} onChange={e => {
            changeHandler(e.currentTarget.checked, 'check');
          }}
            checked={checkedInputs.includes('check') ? true : false}
          ></input>
          <div>얼굴사진 특정정보 수집•이용 동의<span style={{ color: '#0172ce' }}>(필수)</span></div>
        </div>
        <table className={style.tableWrapper}>
          <tr>
            <th>수집•이용 목적</th>
            <td >{sendData1.contents1}</td>
          </tr>
          <tr>
            <th>보유 및 이용 기간</th>
            <td >{sendData1.contents2}</td>
          </tr>
        </table>
        <div className={style.infoWrapper}>
          <div className={style.info}>{sendData1.contents3}</div>
          <div className={style.info} style={{marginTop:'3%'}}>
            타인의 얼굴의 얼굴을 등록시 발생하는 모든 문제에 대해서는 서비스를 제공하는 (주)에스원에서 책임지지 아니하며
            임의 등록으로 발생하는 모든 책임은 사용자 본인에게 귀책이 있음을 안내드립니다
          </div>
        </div>
      </div>

      <div className={style.contentWrapper}>
        <div className={style.secondCheck}>
          <input id="check2" type="checkbox" style={{ marginRight: '10px' }} onChange={e => {
            changeHandler1(e.currentTarget.checked, 'check2');
          }}
            checked={checkedInputs.includes('check2') ? true : false}
          ></input>
          <div>얼굴사진 원본정보 수집•이용 동의<span style={{ color: '#0172ce' }}>(선택)</span></div>
        </div>
        <table className={style.tableWrapper}>
          <tr>
            <th>수집•이용 목적</th>
            <td >{sendData1.contents4}</td>
          </tr>
          <tr>
            <th>보유 및 이용 기간</th>
            <td >{sendData1.contents5}</td>
          </tr>
        </table>
      </div>
      <SubmitButton label={"동의합니다"} onClick={handleClick} />
      {
        open === true
        ?<AgreementsModal setOpen={setOpen} open={open} nextBtn={nextBtn} />
        :null

      }
    </div>
  );
};

export default Agreements;