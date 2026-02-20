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
    const sections = ['home', 'about', 'experience', 'expertise', 'qualification', 'portfolio', 'contact'];
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
  
  const handleKeyDown = (e, href) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveNav(href);
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav role="navigation" aria-label="Main navigation">
      <a
        data-tooltip-content='Home'
        data-tooltip-id='homeBtn'
        href='#home'
        aria-label='Navigate to Home section'
        onClick={() => setActiveNav('#home')}
        onKeyDown={(e) => handleKeyDown(e, '#home')}
        className={activeNav === '#home' ? 'active' : ''}
        tabIndex="0"
      >
        <AiOutlineHome aria-hidden="true" />
      </a>
      <a
        data-tooltip-content='About'
        data-tooltip-id='aboutBtn'
        href='#about'
        aria-label='Navigate to About section'
        onClick={() => setActiveNav('#about')}
        onKeyDown={(e) => handleKeyDown(e, '#about')}
        className={activeNav === '#about' ? 'active' : ''}
        tabIndex="0"
      >
        <AiOutlineUser aria-hidden="true" />
      </a>
      <a
        data-tooltip-content='Experience'
        data-tooltip-id='experienceBtn'
        href='#experience'
        aria-label='Navigate to Experience section'
        onClick={() => setActiveNav('#experience')}
        onKeyDown={(e) => handleKeyDown(e, '#experience')}
        className={activeNav === '#experience' ? 'active' : ''}
        tabIndex="0"
      >
        <BiBook aria-hidden="true" />
      </a>
      <a
        data-tooltip-content='Expertise'
        data-tooltip-id='expertiseBtn'
        href='#expertise'
        aria-label='Navigate to Expertise section'
        onClick={() => setActiveNav('#expertise')}
        onKeyDown={(e) => handleKeyDown(e, '#expertise')}
        className={activeNav === '#expertise' ? 'active' : ''}
        tabIndex="0"
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
        onKeyDown={(e) => handleKeyDown(e, '#qualification')}
        className={activeNav === '#qualification' ? 'active' : ''}
        tabIndex="0"
      >
        <SlGraduation aria-hidden="true" />
      </a>
      <a
        data-tooltip-content='Portfolio'
        data-tooltip-id='portfolioBtn'
        href='#portfolio'
        aria-label='Navigate to Portfolio section'
        onClick={() => setActiveNav('#portfolio')}
        onKeyDown={(e) => handleKeyDown(e, '#portfolio')}
        className={activeNav === '#portfolio' ? 'active' : ''}
        tabIndex="0"
      >
        <RiServiceLine aria-hidden="true" />
      </a>
      <a
        data-tooltip-content='Contact'
        data-tooltip-id='contactBtn'
        href='#contact'
        aria-label='Navigate to Contact section'
        onClick={() => setActiveNav('#contact')}
        onKeyDown={(e) => handleKeyDown(e, '#contact')}
        className={activeNav === '#contact' ? 'active' : ''}
        tabIndex="0"
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
