import './expertise.css';
import { BiCheck } from 'react-icons/bi';
import { useState, useEffect, useRef } from 'react';

const Expertise = () => {
  const [visibleCards, setVisibleCards] = useState(new Set());
  const observerRef = useRef();
  const sectionRef = useRef();

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardIndex = entry.target.dataset.cardIndex;
            setVisibleCards(prev => new Set([...prev, cardIndex]));
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    );

    const cards = sectionRef.current?.querySelectorAll('.expertise');
    cards?.forEach((card, index) => {
      card.dataset.cardIndex = index;
      observerRef.current?.observe(card);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <section id='expertise' ref={sectionRef}>
      <h1 className='small-title animate-fade-in'>What I Offer</h1>
      <h2 className='medium-title animate-fade-in'>Expertise</h2>

      <div className='container expertises__container'>
        <article className={`expertise ${visibleCards.has('0') ? 'expertise--visible' : ''}`} data-card-index="0">
          <div className='expertise__head'>
            <div className='expertise__icon'>
              <svg viewBox="0 0 24 24" width="32" height="32">
                <path fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <h3>Frontend Development</h3>
            
          </div>

          <ul className='expertise__list'>
            <li style={{'--item-delay': '0ms'}}>
              <BiCheck className='expertise__list-icon' />
              <p>Responsive web design with HTML, CSS & JavaScript</p>
            </li>
            <li style={{'--item-delay': '100ms'}}>
              <BiCheck className='expertise__list-icon' />
              <p>React.js component development & state management</p>
            </li>
            <li style={{'--item-delay': '200ms'}}>
              <BiCheck className='expertise__list-icon' />
              <p>Bootstrap & Tailwind CSS styling frameworks</p>
            </li>
            <li style={{'--item-delay': '300ms'}}>
              <BiCheck className='expertise__list-icon' />
              <p>Cross-browser compatibility & optimization</p>
            </li>
            <li style={{'--item-delay': '400ms'}}>
              <BiCheck className='expertise__list-icon' />
              <p>Mobile-first responsive design approach</p>
            </li>
            <li style={{'--item-delay': '500ms'}}>
              <BiCheck className='expertise__list-icon' />
              <p>Performance optimization & accessibility</p>
            </li>
          </ul>
        </article>
        {/* End of UI/UX */}

        <article className={`expertise ${visibleCards.has('1') ? 'expertise--visible' : ''}`} data-card-index="1">
          <div className='expertise__head'>
            <div className='expertise__icon'>
              <svg viewBox="0 0 24 24" width="32" height="32">
                <path fill="currentColor" d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/>
              </svg>
            </div>
            <h3>Backend Development</h3>
            
          </div>

          <ul className='expertise__list'>
            <li style={{'--item-delay': '0ms'}}>
              <BiCheck className='expertise__list-icon' />
              <p>REST API development with Node.js & Express</p>
            </li>
            <li style={{'--item-delay': '100ms'}}>
              <BiCheck className='expertise__list-icon' />
              <p>Database design with MongoDB & MySQL</p>
            </li>
            <li style={{'--item-delay': '200ms'}}>
              <BiCheck className='expertise__list-icon' />
              <p>Server-side logic & business implementation</p>
            </li>
            <li style={{'--item-delay': '300ms'}}>
              <BiCheck className='expertise__list-icon' />
              <p>Data structures & algorithms optimization</p>
            </li>
            <li style={{'--item-delay': '400ms'}}>
              <BiCheck className='expertise__list-icon' />
              <p>Python scripting and process automation</p>
            </li>
            <li style={{'--item-delay': '500ms'}}>
              <BiCheck className='expertise__list-icon' />
              <p>Version control & collaborative development</p>
            </li>
          </ul>
        </article>
        {/* Eend of Web Development */}

        <article className={`expertise ${visibleCards.has('2') ? 'expertise--visible' : ''}`} data-card-index="2">
          <div className='expertise__head'>
            <div className='expertise__icon'>
              <svg viewBox="0 0 24 24" width="32" height="32">
                <path fill="currentColor" d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
              </svg>
            </div>
            <h3>Testing & AI/ML</h3>
            
          </div>

          <ul className='expertise__list'>
            <li style={{'--item-delay': '0ms'}}>
              <BiCheck className='expertise__list-icon' />
              <p>iOS application testing & quality assurance</p>
            </li>
            <li style={{'--item-delay': '100ms'}}>
              <BiCheck className='expertise__list-icon' />
              <p>Automated testing & bug identification</p>
            </li>
            <li style={{'--item-delay': '200ms'}}>
              <BiCheck className='expertise__list-icon' />
              <p>Machine learning model development</p>
            </li>
            <li style={{'--item-delay': '300ms'}}>
              <BiCheck className='expertise__list-icon' />
              <p>Python data analysis & visualization</p>
            </li>
            <li style={{'--item-delay': '400ms'}}>
              <BiCheck className='expertise__list-icon' />
              <p>Problem-solving & analytical thinking</p>
            </li>
            <li style={{'--item-delay': '500ms'}}>
              <BiCheck className='expertise__list-icon' />
              <p>Technical documentation & reporting</p>
            </li>
          </ul>
        </article>
        {/* End of Content Creation */}
      </div>
    </section>
  );
};

export default Expertise;
