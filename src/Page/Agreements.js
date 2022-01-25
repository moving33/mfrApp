import React, { useState, useEffect } from "react";
import style from "../Css/Main.module.css";
import Box from "../Component/Box";
import SubmitButton from "../Component/SubmitButton";
import ReactModal from 'react-modal'
import qs from "qs";
import utils from "../utils";
import { useHistory } from "react-router";
import { PREFIX, API_URL } from "../config";
import axios from "axios";

const Agreements = () => {

  // const [openModal, setOpenModal] = useState(false);
  const [checkedInputs, setCheckedInputs] = useState([]);
  const [sendData, setSendDate] = useState([])
  const [sendData1, setSendDate1] = useState([])
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

  // function openModalHandler() {
  //   setOpenModal(!openModal)
  // }

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
    if (!(checkedInputs.includes('check'))) {
      alert('필수 선택에 동의해 주셔야 합니다.');
      return;
    }
    else {
      const { q } = qs.parse(window.location.search.slice(1));
      console.log(q);
      console.log(sendData); // 전 페이지에서 넘어온 정보 들 
      const _data = JSON.parse(utils.decode(q));
      _data.agree = true;

      let payload = {
        site_manage_phone: sendData.tel
        , site_manage_name: sendData.name
        , site_idx: sendData.site_idx
        , step_idx: sendData.step_idx
      };
      console.log(payload);
      axios.post(`${API_URL}/v1/info/personalAcceptData`, payload)
        .then((res) => {
          if (res.data.result === "true") {
            history.replace(`${PREFIX}/select?q=${utils.encode(JSON.stringify(_data))}`);
          } else {
            history.replace('/Errorpage');
          }
        })
    }
  };

  useEffect(() => {
    console.log(window.history.state)
    window.history.pushState(null, document.title, window.location.href); 
    window.addEventListener('popstate', function(event) { window.history.pushState(null, document.title, window.location.href); });
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
          <div className={style.info}>타인의 얼굴의 얼굴을 등록시 발생하는 모든 문제에 대해서는 서비스를 제공하는 (주)에스원에서 책임지지 아니하며
           임의 등록으로 발생하는 모든 책임은 사용자 본인에게 귀책이 있음을 안내드립니다</div>
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
            <th>수집•이용 목적</th>
            <td >{sendData1.contents5}</td>
          </tr>
        </table>
      </div>
      <SubmitButton label={"동의합니다"} onClick={handleClick} />
      {/* <OpenedModal isOpen={openModal} onClose={openModalHandler} openModalHandler={openModalHandler} setOpenModal={setOpenModal} handleClick={handleClick}/> */}
    </div>
  );
};

// function OpenedModal({isOpen, onClose,openModalHandler, handleClick}) {
//   return(
//     <ReactModal
//     isOpen={isOpen}
//     onClose={openModalHandler}
//     style={{
//       content: {
//         width: '300px',
//         height: '390px',
//         margin: 'auto'
//       }
//     }}>
//       <div className={style.modalContainer}>
//         <div className={style.modalTitle}>
//           <div>얼굴사진 원본 정보 수집•이용 미동의 시<br />
//               아래와 같이 일부 기능이 제한됩니다.</div>
//         </div>

//         <div className={style.modalSecond}>
//           <div>01.<br />
//             리더기가 업데이트 되는 경우<br />
//             얼굴 인증 불가능 (얼굴 재등록 필요)
//           </div>
//         </div>

//         <div className={style.modalThird}>
//           <div>02.<br />
//             다른 리더기에 매니저를 통한<br />
//             사용자 정보 전송 불가능
//           </div>
//         </div>

//         <div className={style.modalAgreement}>동의하시겠습니까?</div>
//         <div className={style.btnWrapper}>
//           <button onClick={onClose} className={style.leftBtn}>미동의</button>
//           <button className={style.rightBtn} onClick={handleClick}>동의</button>
//         </div>
//       </div>
//     </ReactModal>
//   )
// }

export default Agreements;