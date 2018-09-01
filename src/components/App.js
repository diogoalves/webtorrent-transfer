import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Uploader from './Uploader';
import Downloader from './Downloader';
import withRoot from './withRoot';

class App extends Component {
  render() {
    return (
      <div>
        <Route path="/" component={Uploader} />
        <Route path="/:downloadLink" component={Downloader} />
      </div>
    );
  }
}

export default withRoot(App);
