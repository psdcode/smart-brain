import React, { Component } from 'react';
// import Particles from 'react-particles-js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Modal from './components/Modal/Modal';
import Profile from './components/Profile/Profile';
import './App.css';

// const particlesOptions = {
//   particles: {
//     number: {
//       value: 30,
//       density: {
//         enable: true,
//         value_area: 800
//       }
//     }
//   }
// }

const initialState = {
  input: '',
  imageUrl: '',
  boxes: [],
  route: 'signin',
  isSignedIn: false,
  isProfileOpen: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: '',
    age: 0,
    pet: ''
  }
}

class App extends Component {
  constructor () {
    super();
    this.state = initialState;
  }

  componentDidMount () {
    const token = this.getToken();
    if (token) {
      this.fetchData({ route: 'signin', method: 'post', token })
        .then((data) => {
          if (data && data.id) {
            this.fetchData({ route: 'profile', method: 'get', id: data.id, token })
              .then((user) => {
                if (user && user.email) {
                  this.loadUser(user);
                  this.onRouteChange('home');
                }
              })
              .catch(console.log);
          }
        })
        .catch(console.log);
    }
  }

  fetchData = ({ route, method, id, token, body, noJSON }) => {
    // Set options to pass with fetch request
    const fetchOptions = { 
      headers: { 'Content-Type': 'application/json' },
      method
    };
    if (token) {
      fetchOptions.headers.Authorization = token;
    }
    if (body) {
      fetchOptions.body = body;
    }

    // Set route 
    const fetchRoute = `${route}${route === 'profile' && id ? `/${id}` : ''}`;
    
    // Fetch Promise()
    return fetch(`http://localhost:3000/${fetchRoute}`, fetchOptions)
      .then((resp) => {
        return noJSON ? resp : resp.json();
      })
      .catch(console.log);
  };

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
        age: data.age,
        pet: data.pet,
      }
    });
  };

  calculateFacesLocation = ({ outputs }) => {
    if (outputs && outputs[0].data.regions) {
      const image = document.getElementById('inputimage');
      const width = Number(image.width);
      const height = Number(image.height);
      const clarifaiFacesData = outputs[0].data.regions.map((face) => (face.region_info.bounding_box));
      return clarifaiFacesData.map((faceBounds) => ({
        leftCol: faceBounds.left_col * width,
        topRow: faceBounds.top_row * height,
        rightCol: width - (faceBounds.right_col * width),
        bottomRow: height - (faceBounds.bottom_row * height)
      }));
    } else {
      return [];
    }
  };

  displayFacesBoxes = (boxes) => {
    this.setState({ boxes });
  };

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  };

  onButtonSubmit = () => {
    if (this.state.input !== '') {
      this.setState((state) => ({imageUrl: state.input}));
      const token = this.getToken();
      const body = JSON.stringify({ input: this.state.input })
      this.fetchData({ route: 'imageurl', method: 'post', token, body })
        .then(response => {
          if (response) {
            const body = JSON.stringify({ id: this.state.user.id });
            this.fetchData({ route: 'image', method: 'put', token, body })
              .then(count => {
                this.setState((state) => ({ ...state, user: { ...state.user, entries: count} }));
              })
              .catch(console.log)

          }
          this.displayFacesBoxes(this.calculateFacesLocation(response))
        })
        .catch(err => console.log(err));
    }
  }

  saveToken = (token) => (window.sessionStorage.setItem('token', token));
  
  getToken = () => (window.sessionStorage.getItem('token'));

  removeToken = () => (window.sessionStorage.removeItem('token'));

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.removeToken();
      this.setState(initialState);
    } else if (route === 'home') {
      this.setState({ route, isSignedIn: true })
    } else {
      // route = 'signin' || 'register'
      this.setState({ route });
    }
  }

  isProfileOpen = () => (this.state.isProfileOpen);

  toggleModal = () => {
    this.setState((prevState) => ({ isProfileOpen: !prevState.isProfileOpen }));
  };

  render() {
    const { isSignedIn, imageUrl, route, boxes, isProfileOpen } = this.state;
    return (
      <div className="App">
        {/*<Particles className='particles'
          params={particlesOptions}
        />*/}
        <Navigation
          isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}
          toggleModal={this.toggleModal} 
        />
        { isProfileOpen && route === 'home' &&
          <Modal>
            <Profile 
              user={this.state.user}
              loadUser={this.loadUser}
              toggleModal={this.toggleModal}
              isProfileOpen={this.isProfileOpen}
              onRouteChange={this.onRouteChange}
              fetchData={this.fetchData}
              getToken={this.getToken}
            />
          </Modal>
        }
        { route === 'home'
          ? <div>
              <Logo />
              <Rank
                name={this.state.user.name}
                entries={this.state.user.entries}
              />
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
            </div>
          : (
             route === 'signin'
             ? <Signin 
                loadUser={this.loadUser} 
                onRouteChange={this.onRouteChange} 
                fetchData={this.fetchData} 
                saveToken={this.saveToken} 
                />
             : (route === 'register' 
                && <Register 
                    loadUser={this.loadUser} 
                    onRouteChange={this.onRouteChange} 
                    fetchData={this.fetchData} 
                    saveToken={this.saveToken} 
                    />
                )
            )
        }
      </div>
    );
  }
}

export default App;
