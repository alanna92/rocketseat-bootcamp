import Reactrotron from 'reactotron-react-native';

if (__DEV__) {
  const tron = Reactrotron.configure({ host: '192.168.15.5' })
    .useReactNative()
    .connect();

  console.tron = tron;

  tron.clear();
}
