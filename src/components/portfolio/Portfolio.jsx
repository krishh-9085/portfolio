import { useState, useEffect, useRef } from 'react';
import { BsArrowDownCircle, BsArrowUpCircle } from 'react-icons/bs';
import { subscribeToProjects } from '../../services/projectsService';
import './portfolio.css';


const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [count, setCount] = useState(6);
  const [isExpanding, setIsExpanding] = useState(false);
  const [visibleItems, setVisibleItems] = useState(new Set());
  const observerRef = useRef();
  const portfolioRef = useRef();

  useEffect(() => {
    const unsubscribe = subscribeToProjects(
      (items) => {
        setProjects(items);
        setCount((prevCount) => {
          if (items.length <= 6) {
            return items.length;
          }

          if (prevCount !== 6 && prevCount > items.length) {
            return items.length;
          }

          return prevCount;
        });
        setIsLoading(false);
      },
      () => {
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const itemId = entry.target.dataset.itemId;
            setVisibleItems(prev => new Set([...prev, itemId]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Observe portfolio items when they mount
  useEffect(() => {
    const items = portfolioRef.current?.querySelectorAll('.portfolio__item');
    items?.forEach(item => {
      observerRef.current?.observe(item);
    });

    return () => {
      items?.forEach(item => {
        observerRef.current?.unobserve(item);
      });
    };
  }, [count]);

  const handleToggleItems = () => {
    if (projects.length <= 6) {
      return;
    }

    setIsExpanding(true);

    if (count === 6) {
      setCount(projects.length);
    } else {
      setCount(6);
      // Smooth scroll to top of portfolio section
      setTimeout(() => {
        portfolioRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }

    setTimeout(() => {
      setIsExpanding(false);
    }, 800);
  };

  return (
    <section id='portfolio' ref={portfolioRef}>
      <h1 className='small-title animate-fade-in'>My Recent Work</h1>
      <h2 className='medium-title animate-fade-in'>Projects</h2>

      {isLoading && <p className='container'>Loading projects...</p>}

      <div className={`container portfolio__container ${isExpanding ? 'expanding' : ''}`}>
        {projects
          .slice(0, count)
          .map(({ id, image, title, github, demo, tags = [], desc, isNew, isFeatured, isPopular }, index) => {
            const isVisible = visibleItems.has(String(id));
            const animationDelay = `${index * 100}ms`;
            const badges = [];

            if (isNew) {
              badges.push({ key: 'new', className: 'portfolio__badge--new', label: 'NEW' });
            }
            if (isFeatured) {
              badges.push({ key: 'featured', className: 'portfolio__badge--featured', label: 'Featured' });
            }
            if (isPopular) {
              badges.push({ key: 'popular', className: 'portfolio__badge--popular', label: 'Popular' });
            }

            return (
              <article
                key={id}
                data-item-id={id}
                className={`portfolio__item ${isNew ? 'portfolio__item--new' : ''} ${isFeatured ? 'portfolio__item--featured' : ''} ${isPopular ? 'portfolio__item--popular' : ''} ${isVisible ? 'portfolio__item--visible' : ''}`}
                style={{ '--animation-delay': animationDelay }}
              >
                <div className='portfolio__item-image'>
                  <img
                    src={image}
                    width='600'
                    height='420'
                    alt={title}
                    loading="lazy"
                  />

                  {/* Hover overlay with quick actions */}
                  <div className='portfolio__overlay'>
                    <div className='portfolio__overlay-content'>
                      <a
                        href={github}
                        className='portfolio__quick-btn'
                        target='_blank'
                        rel='noreferrer'
                        aria-label={`View ${title} on GitHub`}
                      >
                        <svg viewBox="0 0 24 24" width="20" height="20">
                          <path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z" />
                        </svg>
                      </a>
                      {demo && (
                        <a
                          href={demo}
                          className='portfolio__quick-btn'
                          target='_blank'
                          rel='noreferrer'
                          aria-label={`View ${title} live demo`}
                        >
                          <svg viewBox="0 0 24 24" width="20" height="20">
                            <path fill="currentColor" d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className='portfolio__content'>
                  <h3>{title}</h3>
                  <div className='portfolio__tag'>
                    {tags.map((tag, tagIndex) => {
                      return (
                        <span
                          key={tagIndex}
                          className='portfolio__tag-pill'
                          style={{ '--tag-delay': `${tagIndex * 50}ms` }}
                        >
                          {tag}
                        </span>
                      );
                    })}
                  </div>
                  <p className='portfolio__desc'>{desc}</p>
                  <div className='portfolio__item-cta'>
                    <a
                      href={github}
                      className='btn btn-variant'
                      target='_blank'
                      rel='noreferrer'
                    >
                      Github
                    </a>
                    {demo ? (
                      <a
                        href={demo}
                        className='btn btn-white'
                        target='_blank'
                        rel='noreferrer'
                      >
                        Live Demo
                      </a>
                    ) : (
                      <span
                        className='btn btn-white btn-disabled'
                        aria-disabled='true'
                      >
                        Coming Soon
                      </span>
                    )}
                  </div>
                </div>

                {/* Special badges */}
                {badges.length > 0 && (
                  <div className='portfolio__badge-stack'>
                    {badges.map((badge) => (
                      <div key={badge.key} className={`portfolio__badge ${badge.className}`}>
                        {badge.label}
                      </div>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
      </div>
      <div className='btn-row'>
        {projects.length > 6 && (
          <button
            onClick={handleToggleItems}
            type='button'
            className={`btn btn-dark-variant ${isExpanding ? 'loading' : ''}`}
            disabled={isExpanding}
          >
            {isExpanding ? (
              <div className="loading-spinner"></div>
            ) : (
              <>
                See{' '}
                {count === 6 ? (
                  <>
                    More <BsArrowDownCircle className='moreless' />
                  </>
                ) : (
                  <>
                    Less <BsArrowUpCircle className='moreless' />
                  </>
                )}
              </>
            )}
          </button>
        )}
      </div>
    </section>
  );
};

export default Portfolio;

