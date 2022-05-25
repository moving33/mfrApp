import React, { useState, useEffect } from "react";
import './loading.css';
import loading_000 from "../../assets/loading_000.png"
import loading_001 from "../../assets/loading_001.png"
import loading_002 from "../../assets/loading_002.png"
import loading_003 from "../../assets/loading_003.png"
import loading_004 from "../../assets/loading_004.png"
import loading_005 from "../../assets/loading_005.png"
import loading_006 from "../../assets/loading_006.png"
import loading_007 from "../../assets/loading_007.png"
import loading_008 from "../../assets/loading_008.png"
import loading_009 from "../../assets/loading_009.png"
import loading_010 from "../../assets/loading_010.png"
import loading_011 from "../../assets/loading_011.png"
import loading_012 from "../../assets/loading_012.png"
import loading_013 from "../../assets/loading_013.png"
import loading_014 from "../../assets/loading_014.png"



const LoadingPaper = () => {
  
  // console.log('loading...');

  const [imgscr, setImgsrc] = useState()
  const loadingArr = [
    loading_000,
    loading_001,
    loading_002,
    loading_003,
    loading_004,
    loading_005,
    loading_006,
    loading_007,
    loading_008,
    loading_009,
    loading_010,
    loading_011,
    loading_012,
    loading_013,
    loading_014]
    

  useEffect(() => {
    let i = 0;
    const inter =
      setInterval(() => {
        setImgsrc(loadingArr[i])
        i++
        if( i === 14) i = 0;
      }, 80)
    return () => {
      clearInterval(inter)
    }
  }, [])

  return (
    <div className="loading">
      <img src={imgscr} className='loadingImg'/>
    </div>
  )
}

export default LoadingPaper;