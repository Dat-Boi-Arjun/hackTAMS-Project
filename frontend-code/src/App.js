import React from 'react';

import './App.css';
import SurveyPage from './components/SurveyPage.js'

import { gapi } from 'gapi-script';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {breaks: [], areEvents: false};

    this.CLIENT_ID = "912732343681-u5u8rj00bg0r8s6013386rbckra8h7do.apps.googleusercontent.com";
    this.API_KEY = "AIzaSyDwqWdm3_N973huD2-K0jNk8GC2pHnaAc4";
    this.DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
    this.SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

    gapi.load(this.initClient);

    //Will check calendar every 5 min
    setInterval(this.findBreaks, 5 * 60 * 1000);
  }

  initClient() {
    gapi.client.init({
      apiKey: this.API_KEY,
      clientId: this.CLIENT_ID,
      discoveryDocs: this.DISCOVERY_DOCS,
      scope: this.SCOPES
    });
  }

  findBreaks() {
    gapi.client.calendar.events.list({
      'calendarId': 'primary',
      'timeMin': (new Date()).toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'orderBy': 'startTime'
    }).then(function(response) {
      let events = response.result.items;
      let breaks = [];

      if (events.length > 0) {

        for (let i = 0; i < events.length - 1; i++) {

          if (!events[i].start.dateTime) {
            //It is an all-day event
            continue
          }
          
          let thisEventEnd = new Date(events[i].end.dateTime);
          let  nextEventStart = new Date(events[i+1].start.dateTime);

          //Time between two events in minutes
          let interval = nextEventStart.getTime() - thisEventEnd.getTime() / (60 * 1000)
          if (interval > 2) {
            breaks.push({
              when: thisEventEnd,
              length: interval
            });
          }
        }

        this.setState({breaks: breaks, areEvents: true});
      } 
      
      else {
        breaks.push(null)
        this.setState({breaks: breaks, areEvents: false});
      }

      
    });
  }

  render() {
    let onBreak = false;
    let breakMessage = null;
    let nextBreak = this.state.breaks[0]

    let display = null

    if (this.state.areEvents) {
      if (nextBreak.when.getTime() == Date.now()) {
        //Removing current break
        let new_breaks = [...this.state.breaks]
        new_breaks.shift()

        this.setState({
          breaks: new_breaks
        });

        onBreak = true
      }

      else {
        breakMessage = <p>
          {`Your next break is ${nextBreak.length} minutes long at ${nextBreak.when.toLocaleTimeString()}`}
        </p>
      }

      display = onBreak ? <SurveyPage/> : breakMessage
    }

    else {
      display = <p>There are no events in your calendar</p>
    }
    return (
      <div className="App">
        {display}
      </div>
    );
  }
}

export default App;
