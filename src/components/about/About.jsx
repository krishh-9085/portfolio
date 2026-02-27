import './about.css';
import MeJpg1000 from '../../assets/web-developer-bg-1000-min.jpg';
import MeWebp1000 from '../../assets/web-developer-bg-1000-min.webp';
import MeJpg440 from '../../assets/web-developer-bg-440-min.jpg';
import MeWebp440 from '../../assets/web-developer-bg-440-min.webp';
import MeJpg250 from '../../assets/web-developer-bg-250-min.jpg';
import MeWebp250 from '../../assets/web-developer-bg-250-min.webp';
import { FaAward } from 'react-icons/fa';
import { TfiHeadphoneAlt } from 'react-icons/tfi';
import { VscFolderLibrary } from 'react-icons/vsc';

const About = () => {
  return (
    <section id='about'>
      <h1 className='small-title'>Get To Know</h1>
      <h2 className='medium-title'>About Me</h2>

      <div className='container about__container'>
        <div className='about__me'>
          <div className='about__me-image'>
            <picture>
              <source
                media='(max-width: 600px)'
                srcSet={MeWebp250}
                type='image/webp'
                width='250'
                height='250'
              />
              <source
                media='(max-width: 1024px)'
                srcSet={MeWebp440}
                type='image/webp'
                width='440'
                height='440'
              />
              <source
                media='(min-width: 1025px)'
                srcSet={MeWebp1000}
                type='image/webp'
                width='1000'
                height='1000'
              />
              <source
                media='(max-width: 600px)'
                srcSet={MeJpg250}
                type='image/jpeg'
                width='250'
                height='250'
              />
              <source
                media='(max-width: 1024px)'
                srcSet={MeJpg440}
                type='image/jpeg'
                width='440'
                height='440'
              />
              <source
                media='(min-width: 1025px)'
                srcSet={MeJpg1000}
                type='image/jpeg'
                width='1000'
                height='1000'
              />
              <img
                src={MeJpg1000}
                alt='Krishna Rohilla portrait'
                width='1000'
                height='1000'
              />
            </picture>
          </div>
        </div>

        <div className='about__content'>
          <p className='about__intro'>
            Full-Stack Developer focused on clean UI, reliable APIs, and fast web experiences.
          </p>

          <div className='about__cards'>
            <article className='about__card'>
              <FaAward className='about__icon' />
              <h3>Experience</h3>
              <small>6+ Months Working</small>
            </article>

            <article className='about__card'>
              <VscFolderLibrary className='about__icon' />
              <h3>Projects</h3>
              <small>10+ Completed</small>
            </article>

            <article className='about__card'>
              <TfiHeadphoneAlt className='about__icon' />
              <h3>Learning</h3>
              <small>Always Growing</small>
            </article>
          </div>

          <p className='about__description'>
            I am a passionate developer based in India, building responsive and user-focused products
            with React, JavaScript, Node.js, and modern web tooling.
          </p>

          <ul className='about__highlights'>
            <li>Builds responsive interfaces with performance-first practices.</li>
            <li>Designs scalable backend logic and clean data flow.</li>
            <li>Continuously learning and shipping real-world projects.</li>
          </ul>

          <div className='about__actions'>
            <a href='#contact' className='btn btn-primary'>
              Let&apos;s Talk
            </a>
            <a href='#portfolio' className='btn'>
              View Projects
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
