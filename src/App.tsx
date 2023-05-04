import './App.css';
import Main from './view/page/main';
import HomeAssistantService from './service/HomeAssistantService';
import { useEffect, useState } from 'react';

function App() {
  const width = window.innerWidth
  const [picture, setPicture] = useState('')
  useEffect(() => {
    HomeAssistantService.getCameraList()
      .then((data) => {
        if (data && data.length > 0) {
          setPicture(data[0].picture)
        }
      })
  })
  return (
    <div className="App">
      <img className='background' alt='背景' width={width + 'px'} height='100%' src={picture} />
      <Main/>
    </div>
  );
}

export default App;
