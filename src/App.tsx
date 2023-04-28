import './App.css';
import Main from './view/page/main';

function App() {
  const width = window.innerWidth
  return (
    <div className="App">
      <img className='background' alt='背景' width={width + 'px'} height='100%' src='https://ha.ismy.wang/api/camera_proxy/camera.chuangmi_039a01_1c36_camera_control?token=350c9ec7f2c61ec9dbad19279b82e6806588eb65318cf2202ae22821df034142' />
      <Main/>
    </div>
  );
}

export default App;
