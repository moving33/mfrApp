import React, { useState, useEffect } from "react";
import style from "../Css/Main.module.css";
import Box from "../Component/Box";
import SubmitButton from "../Component/SubmitButton";
import ReactModal from 'react-modal'
import qs from "qs";
import utils from "../utils";
import AgreementsModal from "../Component/AgreementsModal";
import UsefulModal from "../Component/UsefulModal";
import { useHistory } from "react-router";
import { PREFIX, API_URL } from "../config";
import axios from "axios";

const Agreements = () => {

    const [open, setOpen] = useState(false);
    const [checkModal, setCheckModal] = useState(false);
    const [checkedInputs, setCheckedInputs] = useState([]);
    const [sendData, setSendDate] = useState([]);
    const [sendData1, setSendDate1] = useState([]);
    const history = useHistory();
    var intFrameHeight = window.innerHeight;
    var nowScroll = window.pageYOffset;
    const [ScrollY, setScrollY] = useState(0);  // 스크롤값을 저장하기 위한 상태
    const handleFollow = () => {
        setScrollY(window.pageYOffset); // window 스크롤 값을 ScrollY에 저장
    }

    useEffect(() => {
        console.log("ScrollY is ", ScrollY); // ScrollY가 변화할때마다 값을 콘솔에 출력
    }, [ScrollY])

    useEffect(() => {
        const watch = () => {
            window.addEventListener('scroll', handleFollow);
        }
        watch(); // addEventListener 함수를 실행
        return () => {
            window.removeEventListener('scroll', handleFollow); // addEventListener 함수를 삭제
        }
    })

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
        console.log('agreements q : ', JSON.parse(utils.decode(q)));

        window.scrollTo({top:0, left:0, behavior:'auto'});

    }, []);

    useEffect(() => {
        console.log(checkedInputs)
    }, [checkedInputs])

    const handleClick = () => {
        console.log('run');
        // if (!(checkedInputs.includes('check', 'check2')) ||
        //     !(checkedInputs.includes('check')) ||
        //     !(checkedInputs.includes('check2'))) {
        //     return;
        // }

        nextBtn()

    };

    const nextBtn = () => {
        const { q } = qs.parse(window.location.search.slice(1));
        console.log(q);
        console.log('sendData :', sendData); // 전 페이지에서 넘어온 정보들
        const _data = JSON.parse(utils.decode(q));
        console.log("_data :", _data);
        _data.agree = true;

        let payload = {
            site_manage_phone: sendData.tel,
            site_manage_name: sendData.name,
            site_idx: sendData.site_idx,
            step_idx: sendData.step_idx,
        };

        console.log('agreements payload : ', payload);
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
        window.addEventListener('popstate', function (event) {
            window.history.pushState(null, document.title, window.location.href);
        });
    }, [window.location.href]);

    return (
        <div className={style.container} style={{ height: '110vh' }}>
            <Box step={2} text1="개인정보" text2="수집 • 이용 동의" />
            <div className={style.group17}></div>

            <div className={style.agree}>
                <input id="check" type="checkbox"
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
                    id='check1'
                /><label style={{ marginRight: "10px" }} for='check1'></label>
                <div className={style.borderBtm}>전체 동의하기</div>
            </div>

            <div className={style.contentWrapper}>

                <div className={style.secondCheck}>
                    <input label="check" type="checkbox" style={{ marginRight: '10px' }} onChange={e => {
                        changeHandler(e.currentTarget.checked, 'check');
                    }}
                        id='check2'
                        checked={checkedInputs.includes('check') ? true : false}
                    /><label style={{ marginRight: "10px" }} for='check2'></label>
                    <div style={{ fontSize: '16px', fontWeight: 700 }}>얼굴사진 특징정보 수집•이용 동의<span style={{ color: '#0172ce' }}>(필수)</span></div>
                </div>

                <table className={style.tableWrapper}>
                    <tr>
                        <th className={style.agreementsTh}>수집•이용 목적</th>
                        <td classNAme={style.agreementsTd}>{sendData1.contents1}</td>
                    </tr>
                    <tr>
                        <th className={style.agreementsTh}>보유 및 이용 기간</th>
                        <td classNAme={style.agreementsTd}>{sendData1.contents2}</td>
                    </tr>
                </table>

                <div className={style.infoWrapper}>
                    <div className={style.info}>{sendData1.contents3}</div>
                    <div className={style.info} style={{ marginTop: '3%' }}>
                        {sendData1.contents6}
                    </div>
                </div>
            </div>

            <div className={style.contentWrapper}>

                <div className={style.secondCheck}>
                    <input id="check2" type="checkbox" style={{ marginRight: '10px' }} onChange={e => {
                        changeHandler1(e.currentTarget.checked, 'check2');
                    }}
                        checked={checkedInputs.includes('check2') ? true : false}
                        id='check3'
                    /><label style={{ marginRight: "10px" }} for='check3'></label>
                    <div style={{ fontSize: '16px', fontWeight: 700 }}>얼굴사진 원본정보 수집•이용 동의<span style={{ color: '#0172ce' }}>(필수)</span></div>
                </div>

                <table className={style.tableWrapper}>
                    <tr>
                        <th className={style.agreementsTh}>수집•이용 목적</th>
                        <td classNAme={style.agreementsTd}>{sendData1.contents4}</td>
                    </tr>
                    <tr>
                        <th className={style.agreementsTh}>보유 및 이용 기간</th>
                        <td classNAme={style.agreementsTd}>{sendData1.contents5}</td>
                    </tr>
                </table>
            </div>

            <div className={style.gradientWapper}>
                {
                    ScrollY > 15
                        ? null
                        : <div className={style.gradient} />
                }

                {
                    !(checkedInputs.includes('check', 'check2')) || !(checkedInputs.includes('check')) || !(checkedInputs.includes('check2'))
                        ? <div className={style.AgreementsPageButton} style={{ bottom: 0, zIndex: 999 }}> <SubmitButton label={"동의합니다"} color={'#dcdcdc'} borderColor={'#dcdcdc'} /></div>
                        : <div className={style.AgreementsPageButton} style={{ bottom: 0, zIndex: 999 }}> <SubmitButton label={"동의합니다"} onClick={handleClick} /></div>
                }
            </div>
        </div>
    );
};

export default Agreements;