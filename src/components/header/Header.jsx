import './header.css';
import Cta from './CTA';
import MEpng from '../../assets/web-developer-min.png';
import MEwebp from '../../assets/web-developer-min.webp';
import HeaderSocial from './HeaderSocial';
import { useTypewriter, Cursor } from 'react-simple-typewriter';

const Header = () => {
  const [text] = useTypewriter({
    words: ['Full Stack Developer', 'Frontend Developer', 'Backend Developer', 'MERN Stack Developer'],
    loop: true
  });

  return (
    <header id='home' role="banner">
      <div className='container header__container'>
        <h1 className='small-title'>Hello, I am</h1>
        <a href='#home' aria-label="Go to home section">
          <h2 className='big-title'>Krishna Rohilla</h2>
        </a>
        <div className='typewriter' aria-live="polite" aria-label="Current role">
          <span className='text-gradient'>{text}</span>
          <Cursor cursorColor='#444444' cursorStyle='|' />
        </div>
        <Cta />
        <HeaderSocial />

        <div className='me'>
          <picture>
            <source srcSet={MEwebp} type='image/webp' />
            <img
              src={MEpng}
              width='304'
              height='482'
              alt='Krishna Rohilla - Professional headshot'
              loading="eager"
            />
          </picture>
        </div>

        <div className='mouse' aria-hidden="true"></div>
        <a href='#contact' className='scroll__down' aria-label="Scroll down to contact section">
          Scroll Down
        </a>
      </div>
    </header>
  );
};

export default Header;
