import React from 'react';

const Navigation = ({ onRouteChange, isSignedIn }) => {
  const navStyle = {display: 'flex', justifyContent: 'flex-end'};
  if (isSignedIn) {
    return (
      <nav style={navStyle}>
        <p onClick={() => onRouteChange('signout')} className='f3 link dim black underline pa3 pointer'>Sign Out</p>
      </nav>
    );
  } else {
    return (
      <nav style={navStyle}>
        <p onClick={() => onRouteChange('signin')} className='f3 link dim black underline pa3 pointer'>Sign In</p>
        <p onClick={() => onRouteChange('register')} className='f3 link dim black underline pa3 pointer'>Register</p>
      </nav>
    );
  }
};

export default Navigation;
