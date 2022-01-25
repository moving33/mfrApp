import React from 'react';
import { useEffect } from 'react';

const ClosePage = () => {

  const close = (e) => {
    e.preventDefault();
    window.close();
    window.top.close();
    window.parent.close();
  }

  return (
  <div>
    <button onClick={close}>close</button>
  </div>
    );
};

export default ClosePage;
