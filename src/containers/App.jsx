import React, { useState } from 'react';

import Basics from '../components/Basics';
import DotMover from '../components/DotMover';
import Webcam from '../components/Webcam';
import Boxes from '../components/Boxes';

const App = () => {
  const [page, setPage] = useState('boxes');


  return (
    <>
      {
        page === 'basics' && <Basics />
      }
      {
        page === 'dotMover' && <DotMover />
      }
      {
        page === 'webcam' && <Webcam />
      }
      {
        page === 'boxes' && <Boxes />
      }
      <button onClick={() => setPage('basics')} type="button">Basics</button>
      <button onClick={() => setPage('dotMover')} type="button">Dot Mover</button>
      <button onClick={() => setPage('webcam')} type="button">Webcam</button>
      <button onClick={() => setPage('boxes')} type="button">Boxes</button>
    </>
  );
};

export default App;
