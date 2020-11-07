import React from 'react';

import './App.css';
import SurveyPage from './SurveyPage.js'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {break: false};
  }

  render() {
    return (
      <div className="App">
        <SurveyPage />
      </div>
    );
  }
}

export default App;
