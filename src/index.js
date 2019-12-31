// import './development';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import reduxStore from './redux/index';
import './index.css';
import App from './App';
import whyDidYouRender from '@welldone-software/why-did-you-render';

whyDidYouRender(React, { onlyLogs: true, include: [/Pure/] });

ReactDOM.render(<Provider store={reduxStore}><App /></Provider>, document.getElementById('root'));
