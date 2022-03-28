import React from 'react';
import style from "../Css/Main.module.css";
import ChalkboardTeacher from '../assets/ChalkboardTeacher.png';
import Eyeglasses from '../assets/Eyeglasses.png';
import Group121 from '../assets/Group121.png';
import good from '../assets/good.png';
import faceCheck from '../assets/faceCheck.png';



const TextFieldItem = (props) => {
    return (
        <div className={style.textFieldItem}>
            <div>
                <img src={ChalkboardTeacher} />
            </div>
            <div>
                <p>{props.text1}</p>
                {props.text2 && <p>{props.text2}</p>}
            </div>
        </div>
    )
}

const CheckTextFields = () => {
    return (

        <div className={style.textFieldsContainer}>

            <div className={style.moveCameraInfo}>

                <div className={style.fontInfo1}>
                    <div style={{width:'15%'}}>
                        <img src={faceCheck} className={style.img} />
                    </div>
                    <div div style={{width:'85%'}}>
                        <div className={style.title9}>안내선에 얼굴 위치를 맞춰주세요</div>
                    </div>
                </div>

                <div className={style.fontInfo1}>
                    <div style={{width:'15%'}}>
                        <img src={ChalkboardTeacher} className={style.img} />
                    </div>
                    <div div style={{width:'85%'}}>
                        <div className={style.title9}>단색 촬영해 주세요</div>
                        </div>
                </div>

                <div className={style.fontInfo1}>
                    <div style={{width:'15%'}}>
                        <img src={good} className={style.img} />
                    </div>
                    <div style={{width:'85%'}}>
                        <div className={style.title9}>자연스러운 표정으로 카메라를</div>
                        <div className={style.title9}>응시해 주세요</div>
                    </div>
                </div>

                <div className={style.fontInfo1}>
                    <div style={{width:'15%'}}>
                        <img src={Group121} className={style.img} />
                    </div>
                    <div div style={{width:'85%'}}>
                        <div className={style.title9}>모자, 선글라스, 마스크는 벗어주세요</div>
                    </div>
                </div>

                <div className={style.fontInfo1}>
                    <div style={{width:'15%'}}>
                        <img src={Eyeglasses} className={style.img} />
                    </div>
                    <div div style={{width:'85%'}}>
                        <div className={style.title9}>안경을 착용하신 분은 평상시 모습</div>
                        <div className={style.title9}>(안경착용)으로 촬영해 주세요</div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default CheckTextFields;