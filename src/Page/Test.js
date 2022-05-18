
import React from "react";
import { useRecoilState } from "recoil";
import { tokenSaver } from "../atom";
import { useHistory } from 'react-router';


const Test = () => {
  const[test, setTest] = useRecoilState(tokenSaver);
  const history = useHistory();


  return(
    <>
    <input value={test} onChange={ e =>{ setTest(e.target.value)}} />
    <button onClick={()=>{
  history.replace(`/camera?q=a206ec9be70425ded9312ef34fcb60f4:4e704b6c59582b4e6e4a5568482f6c536d45697a793059566e39433548696c6658434874335432512b7750477a6667464c4f59684e2b5146324472525173542f4c315258327168684165727578304d5230347457674a7a66374c6935465068596f6461562f67376948656a6a6b4679394571344f46797a4e754e6635`);
    }}>asd</button>
    </>
  )
}

export default Test