import React from 'react';
import './Profile.css';

class Profile extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      name: this.props.user.name,
      entries: this.props.user.entries,
      joined: this.props.user.joined,
      age: this.props.user.age,
      pet: this.props.user.pet
    };

    document.addEventListener('keydown', this.profileEscKeyClose.bind(this));
  }

  onFormChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }
  
  profileEscKeyClose = (e) => {
    // Old IE compatibility check
    e = e || window.event;
    if (e.keyCode === 27 && this.props.isProfileOpen) {
      this.props.toggleModal();
    }
  }

  onProfileUpdate = (data) => {
    const ageCheck = !isNaN(data.age)
      && data.age >= 0
      && data.age < 151
      && data.age % 1 === 0;

    if (!ageCheck) {
      window.alert('Please enter an integer corresponding to your age');
      return;
    }

    // Remove preceding 0's from data.age
    const checkedData = { ...data, age: Number(data.age) }
    // Proceed, data.age is valid    
    const token = this.props.getToken();
    if (token)  {
      this.props.fetchData({ 
        route: 'profile', 
        id: this.props.user.id, 
        method: 'post', 
        token,
        body: JSON.stringify({ formInput: checkedData }),
        noJSON: true
      })
        .then((resp) => {
          if (resp.status === 200 || resp.status === 304) {
            this.props.toggleModal();
            this.props.loadUser({...this.props.user, ...checkedData });
          }
        })
        .catch(console.log);
    } else {
      this.props.onRouteChange('signout');
    }
  };

  render () {
    const { name, entries, joined, age, pet } = this.state;
    return (
      <div className='profile-modal'>
        <article className='br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center bg-white'>
          <main className='pa4 black-80 w-80'>
            <img
              src='http://tachyons.io/img/logo.jpg'
              className='h3 w3 dib'
              alt='avatar'
            />
            <h1>{name}</h1>
            <h4>Images Submitted: {entries}</h4>
            <p>Member since: {joined}</p>
            <hr />
            <label className='mt2 fw6' htmlFor='user-name'>User Name:</label>
            <input
              onChange={this.onFormChange}
              className='pa2 ba w-100'
              value={name}
              type='text'
              name='name'
              id='user-name'
            />
            <label className='mt2 fw6' htmlFor='user-age'>Age:</label>
            <input
              onChange={this.onFormChange}
              className='pa2 ba w-100'
              value={age}
              type='text'
              name='age'
              id='user-age'
            />
            <label className='mt2 fw6' htmlFor='user-pet'>Pet:</label>
            <input
              onChange={this.onFormChange}
              className='pa2 ba w-100'
              value={pet}
              type='text'
              name='pet'
              id='user-pet'
            />
            <div className='mt4' style={{ display: 'flex', justifyContent: 'space-evenly' }}>
              <button className='b pa2 grow pointer hover-white w-40 bg-light-blue b--black-20' onClick={() => (this.onProfileUpdate({ name, age, pet }))}>
                Save
              </button>
              <button className='b pa2 grow pointer hover-white w-40 bg-light-red b--black-20' onClick={this.props.toggleModal}>
                Cancel
              </button>
            </div>
          </main>
          <div className='modal-close' onClick={this.props.toggleModal}>&times;</div>
        </article>
      </div>
    );
  }
}

export default Profile;
