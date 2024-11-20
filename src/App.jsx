import './App.css';
import VideoIframe from './YoutubeFrame';
import logo from './assets/logo.png'
const App = () => {

  return (
    <main className='container mx-auto'>
      <nav className='flex items-center justify-between container mx-auto px-5'>
        <a href="#"><img className='w-48' src={logo} alt="" /></a>
        <ul className='flex items-center gap-9'>
          <li className='text-white'><a href="https://www.facebook.com/ghaguEmerald" target='_blank'>Facebook</a></li>
          <li className='text-white'><a href="https://www.youtube.com/@GhaguEmerald" target='_blank'>Youtube</a></li>
        </ul>
      </nav>
      <div className='youtube-Player mt-20'>
        <VideoIframe videoId={'mO-qxAJwD34'}></VideoIframe>
      </div>
    </main>
  );
};

export default App;
