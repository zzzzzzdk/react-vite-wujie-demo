import { useState } from 'react';
import { Link } from 'react-router-dom';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';

import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        #
        <a href='https://vite.dev' target='_blank'>
          <img src={viteLogo} className='logo' alt='Vite logo' />
        </a>
        <a href='https://react.dev' target='_blank'>
          <img src={reactLogo} className='logo react' alt='React logo' />
        </a>
      </div>
      <h1>Vite + React</h1>
      <nav>
        {/* <Link to='/demo3'>前往 Demo3</Link>
        <Link to='/demo4'>前往 Demo4</Link> */}
      </nav>
      <div className='card'>
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className='read-the-docs'>Click on the Vite and React logos to learn more</p>


    </>
  );
}

export default App;
