import React from 'react';
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

class Profileicon extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      dropdownOpen: false
    };
  }

  toggle = () => {
    this.setState((prevState) => ({ dropdownOpen: !prevState.dropdownOpen }));
  };

  render () {
    return (
      <div className='pa4 tc'>
        <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
          <DropdownToggle
            tag='span'
            data-toggle='dropdown'
            aria-expanded={this.state.dropdownOpen}
          >
            <img
              src='http://tachyons.io/img/logo.jpg'
              className='br-100 ba h3 w3 dib'
              alt='avatar'
            />
          </DropdownToggle>
          <DropdownMenu
            right
            className='b--transparent shadow-5' 
            style={{backgroundColor: 'rgba(255,255,255,0.5)'}}>
            <DropdownItem className='' onClick={this.props.toggleModal}>View Profile</DropdownItem>
            <DropdownItem className='' onClick={() => (this.props.onRouteChange('signout'))}>Signout</DropdownItem>
          </DropdownMenu>
        </ButtonDropdown>
      </div>
    );
  }
}

export default Profileicon;
