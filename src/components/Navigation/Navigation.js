import React from 'react';
import Profileicon from '../Profileicon/Profileicon';

const navStyle = {display: 'flex', justifyContent: 'flex-end'};

const Navigation = ({ onRouteChange, isSignedIn, toggleModal }) => {
  return isSignedIn
    ? (
      <nav style={navStyle}>
        <Profileicon toggleModal={toggleModal} onRouteChange={onRouteChange} />
      </nav>
    )
    : (
      <nav style={navStyle}>
        <p onClick={() => onRouteChange('signin')} className='f3 link dim black underline pa3 pointer'>Sign In</p>
        <p onClick={() => onRouteChange('register')} className='f3 link dim black underline pa3 pointer'>Register</p>
      </nav>
    );
};

export default Navigation;
