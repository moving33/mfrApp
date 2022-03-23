import React, { useState, useRef, useEffect } from 'react';
import Modal from '../Component/Modal';


const TestPage = () => {

  let [open, setOpen] = useState(false);
  let testRef = useRef();

  const handleCloseModal = (e) => {
    if (open && (!testRef.current || !testRef.current.contains(e.target))) setOpen(false);
  }

  useEffect(() => {
    window.addEventListener('click', handleCloseModal);
    return () => {
      window.addEventListener('click', handleCloseModal);
    }
  }, []);

  const nextBtn = () => {
    window.open('/','_self')
  }

  return (
    <div style={{ position: "relative", height: "8888px" }}>

      <button onClick={() => { setOpen(!open) }}>open</button>
      {open && <Modal open={open} setOpen={setOpen} nextBtn={nextBtn} />}
    </div>
  );
};

export default TestPage;
