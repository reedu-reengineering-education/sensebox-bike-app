> [!WARNING]
> Due to performance issues, we switched to Flutter. See https://github.com/reedu-reengineering-education/sensebox-bike-flutter

# senseBox:bike App

The senseBox:bike App is a mobile application developed for iOS and Android platforms using CapacitorJS and React. It allows users to connect to a senseBox:bike device via Bluetooth Low Energy (BLE) and receive sensor data. The app provides visualizations of the sensor data and offers options to export it to files or transmit it to OpenSenseMap.

## Development

To start the development on each platform, run the following commands:

- For iOS: `yarn ios`
- For Android: `yarn android`

## Production Build

To create a production build of the app, run the following command:

```
yarn export
```

This will generate the necessary files for deployment.
