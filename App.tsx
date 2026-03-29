import * as React from 'react';
import {LogBox} from 'react-native';
import {AppNavigation} from './src/config/app-navigation/index';

function App() {
  if (__DEV__) {
    import('./src/reactotron-config');
    LogBox.ignoreAllLogs();
  }
  return <AppNavigation />;
}

export default App;
