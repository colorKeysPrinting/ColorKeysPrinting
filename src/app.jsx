import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { polyfill } from 'es6-promise';
import Home from 'screens/home';

// Polyfill es6 promises for IE
polyfill();

render(<Home />, document.getElementById('main-app'));
