import { BsLinkedin } from 'react-icons/bs';
import { FaGithub } from 'react-icons/fa';

const HeaderSocial = () => {
  return (
    <div className='header__socials'>
      <a
        href='https://www.linkedin.com/in/krishna-rohilla/'
        aria-label='Linkedin'
        target='_blank'
        rel='noreferrer'
      >
        <BsLinkedin />
      </a>
      <a
        href='https://github.com/krishh-9085'
        aria-label='Github'
        target='_blank'
        rel='noreferrer'
      >
        <FaGithub />
      </a>
    </div>
  );
};

export default HeaderSocial;
