import { useContext } from 'react';
import './switch.css';
import { SwitchContext } from '../../contexts/SwitchContext';
import { Tooltip } from 'react-tooltip';

function Switch() {
  const { darkMode, setDarkMode, myStorage } = useContext(SwitchContext);
  return (
    <>
      <div
        data-tooltip-content='Switch Theme'
        data-tooltip-id='modebtn'
        className='wrapper'
      >
        <input
          onChange={() => {
            setDarkMode(!darkMode);
            myStorage.setItem('darkMode', !darkMode);
          }}
          checked={!darkMode}
          type='checkbox'
          name='checkbox'
          className='switch'
          aria-label='Switch Theme'
        />
      </div>
      <Tooltip
        id='modebtn'
        place='left'
        variant='dark'
        effect='solid'
        className='tooltip-mode'
      >
        Switch Theme
      </Tooltip>
    </>
  );
}

export default Switch;
