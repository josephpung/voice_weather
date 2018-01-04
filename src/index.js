import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Geolocator from './Geolocator'
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Geolocator />, document.getElementById('root'));
registerServiceWorker();
