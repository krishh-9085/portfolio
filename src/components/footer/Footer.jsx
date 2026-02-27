import './footer.css';
import { FaLinkedinIn } from 'react-icons/fa';
import { FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer>
      <a href='#home' className='footer__logo'>
        KRISHNA
      </a>

      <ul className='permalinks'>
        <li>
          <a href='#home'>Home</a>
        </li>
        <li>
          <a href='#about'>About</a>
        </li>
        <li>
          <a href='#experience'>Experience</a>
        </li>
        <li>
          <a href='#expertise'>Expertise</a>
        </li>
        <li>
          <a href='#qualification'>Qualification</a>
        </li>
        <li>
          <a href='#portfolio'>Portfolio</a>
        </li>
        <li>
          <a href='#contact'>Contact</a>
        </li>
      </ul>

      <div className='footer__socials'>
        <a
          href='https://www.linkedin.com/in/krishna-rohilla/'
          aria-label='LinkedIn'
          target='_blank'
          rel='noreferrer'
        >
          <FaLinkedinIn />
        </a>
        <a
          href='https://github.com/krishh-9085'
          aria-label='GitHub'
          target='_blank'
          rel='noreferrer'
        >
          <FaGithub />
        </a>

      </div>

      <div className='footer__copyright'>
        <small>
          Created by yours truly,{' '}
          <a
            href='https://www.linkedin.com/in/krishna-rohilla/'
            aria-label='Krishna Rohilla'
            target='_blank'
            rel='noreferrer'
          >
            Krishna Rohilla
          </a>{' '}
          &copy; {new Date().getFullYear()}.
        </small>
      </div>
    </footer>
  );
};

export default Footer;
