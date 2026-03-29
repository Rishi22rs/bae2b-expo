// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
import AsyncStorage from '@react-native-async-storage/async-storage';
import Reactotron from 'reactotron-react-native';

// AsyncStorage would either come from `react-native`
// or
// `@react-native-community/async-storage` depending on where you get it from
Reactotron.configure({
  name: 'DaOne',
})
  .useReactNative({
    asyncStorage: false, // there are more options to the async storage.
    networking: {
      // optionally, you can turn it off with false.
      ignoreUrls: /symbolicate/,
    },
    editor: false, // there are more options to editor
    errors: {veto: () => false}, // or turn it off with false
    overlay: false, // just turning off overlay
  })
  .setAsyncStorageHandler?.(AsyncStorage)
  .connect();

// swizzle the old one
const yeOldeConsoleLog = console.log;

// make a new one
console.log = (...args) => {
  // always call the old one, because React Native does magic swizzling too
  // yeOldeConsoleLog(...args);

  // send this off to Reactotron.
  Reactotron.display({
    name:
      args.length > 0 && typeof args[0] === 'string' ? args[0] : 'CONSOLE.LOG',
    value: args,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    preview: args.length > 0 ? args[1] : undefined,
  });
};
