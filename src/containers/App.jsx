import React, { useState } from 'react';

import Basics from '../components/Basics';
import DotMover from '../components/DotMover';

const App = () => {
  const [page, setPage] = useState('dotMover');


  return (
    <>
      {
        page === 'basics' && <Basics />
      }
      {
        page === 'dotMover' && <DotMover />
      }
      <button onClick={() => setPage('basics')} type="button">Basics</button>
      <button onClick={() => setPage('dotMover')} type="button">Dot Mover</button>
    </>
  );
};

export default App;
