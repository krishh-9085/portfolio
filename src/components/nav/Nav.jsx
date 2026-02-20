import './nav.css';
import { AiOutlineHome } from 'react-icons/ai';
import { AiOutlineUser } from 'react-icons/ai';
import { BiBook } from 'react-icons/bi';
import { BiTask } from 'react-icons/bi';
import { SlGraduation } from 'react-icons/sl';
import { RiServiceLine } from 'react-icons/ri';
import { BsChatDots } from 'react-icons/bs';
import { useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';

const Nav = () => {
  const [activeNav, setActiveNav] = useState('#home');
  
  useEffect(() => {
    // Create intersection observer to detect which section is currently visible
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px', // Only trigger when section is in the middle 50% of viewport
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = `#${entry.target.id}`;
          setActiveNav(sectionId);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observe all sections
    const sections = ['home', 'about', 'experience', 'expertise', 'qualification', 'projects', 'contact'];
    const sectionElements = [];
    
    sections.forEach(sectionId => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
        sectionElements.push(element);
      }
    });

    // Cleanup observer on component unmount
    return () => {
      sectionElements.forEach(element => {
        observer.unobserve(element);
      });
      observer.disconnect();
    };
  }, []);
  
  return (
    <nav role="navigation" aria-label="Main navigation">
      <a
        data-tooltip-content='Home'
        data-tooltip-id='homeBtn'
        href='#home'
        aria-label='Navigate to Home section'
        onClick={() => setActiveNav('#home')}
        className={activeNav === '#home' ? 'active' : ''}
      >
        <AiOutlineHome aria-hidden="true" />
      </a>
      <a
        data-tooltip-content='About'
        data-tooltip-id='aboutBtn'
        href='#about'
        aria-label='Navigate to About section'
        onClick={() => setActiveNav('#about')}
        className={activeNav === '#about' ? 'active' : ''}
      >
        <AiOutlineUser aria-hidden="true" />
      </a>
      <a
        data-tooltip-content='Experience'
        data-tooltip-id='experienceBtn'
        href='#experience'
        aria-label='Navigate to Experience section'
        onClick={() => setActiveNav('#experience')}
        className={activeNav === '#experience' ? 'active' : ''}
      >
        <BiBook aria-hidden="true" />
      </a>
      <a
        data-tooltip-content='Expertise'
        data-tooltip-id='expertiseBtn'
        href='#expertise'
        aria-label='Navigate to Expertise section'
        onClick={() => setActiveNav('#expertise')}
        className={activeNav === '#expertise' ? 'active' : ''}
      >
        <BiTask aria-hidden="true" />
      </a>
      <a
        data-tooltip-content='Qualification'
        data-tooltip-id='qualificationBtn'
        id='menu-qualification'
        href='#qualification'
        aria-label='Navigate to Qualification section'
        onClick={() => setActiveNav('#qualification')}
        className={activeNav === '#qualification' ? 'active' : ''}
      >
        <SlGraduation aria-hidden="true" />
      </a>
      <a
        data-tooltip-content='projects'
        data-tooltip-id='portfolioBtn'
        href='#portfolio'
        aria-label='Navigate to Portfolio section'
        onClick={() => setActiveNav('#portfolio')}
        className={activeNav === '#portfolio' ? 'active' : ''}
      >
        <RiServiceLine aria-hidden="true" />
      </a>
      <a
        data-tooltip-content='Contact'
        data-tooltip-id='contactBtn'
        href='#contact'
        aria-label='Navigate to Contact section'
        onClick={() => setActiveNav('#contact')}
        className={activeNav === '#contact' ? 'active' : ''}
      >
        <BsChatDots aria-hidden="true" />
      </a>

      <Tooltip
        id='homeBtn'
        place='top'
        variant='dark'
        effect='solid'
        className='tooltip noArrow'
      >
        Home
      </Tooltip>
      <Tooltip
        id='aboutBtn'
        place='top'
        variant='dark'
        effect='solid'
        className='tooltip noArrow'
      >
        About
      </Tooltip>
      <Tooltip
        id='experienceBtn'
        place='top'
        variant='dark'
        effect='solid'
        className='tooltip noArrow'
      >
        Experience
      </Tooltip>
      <Tooltip
        id='expertiseBtn'
        place='top'
        variant='dark'
        effect='solid'
        className='tooltip noArrow'
      >
        Expertise
      </Tooltip>
      <Tooltip
        id='qualificationBtn'
        place='top'
        variant='dark'
        effect='solid'
        className='tooltip noArrow'
      >
        Qualification
      </Tooltip>
      <Tooltip
        id='portfolioBtn'
        place='top'
        variant='dark'
        effect='solid'
        className='tooltip noArrow'
      >
        Portfolio
      </Tooltip>
      <Tooltip
        id='contactBtn'
        place='top'
        variant='dark'
        effect='solid'
        className='tooltip noArrow'
      >
        Contact
      </Tooltip>
    </nav>
  );
};

export default Nav;
