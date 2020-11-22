import React, { useState } from 'react';

import Basics from '../components/Basics';
import DotMover from '../components/DotMover';
import Webcam from '../components/Webcam';
import MostBasic from '../components/MostBasic';
import FirstTry from '../components/FirstTry';

const App = () => {
  const [page, setPage] = useState('firstTry');


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
        page === 'mostBasic' && <MostBasic />
      }
      {
        page === 'firstTry' && <FirstTry />
      }
      <button onClick={() => setPage('basics')} type="button">Basics</button>
      <button onClick={() => setPage('dotMover')} type="button">Dot Mover</button>
      <button onClick={() => setPage('webcam')} type="button">Webcam</button>
      <button onClick={() => setPage('mostBasic')} type="button">Most Basic</button>
      <button onClick={() => setPage('firstTry')} type="button">First Try</button>
    </>
  );
};

export default App;
