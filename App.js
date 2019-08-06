import React from 'react';
import { Platform, StatusBar, StyleSheet, View, AppState } from 'react-native';
import { AppLoading, Asset, Font } from 'expo';
import AppNavigator from './navigation/AppNavigator';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadingComplete: false,
      appState: AppState.currentState,
      hasUpdate: false,
      forceUpdate: false,
      checkOnForeground: false,
    };
  }

  _handleAppStateChange = (nextAppState) => {
    this.setState({ appState: nextAppState });
    if (this.state.checkOnForeground) {
      this.checkUpdate();
    }
  };

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/icon.png'),
      ]),
      Font.loadAsync({
        'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf'),
        'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
      }),
    ]);
  };

  _handleLoadingError = (error) => {
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };

  render() {
    if (!this.state.isLoadingComplete) {
      return <AppLoading
        startAsync={this._loadResourcesAsync}
        onError={this._handleLoadingError}
        onFinish={this._handleFinishLoading}
      />
    } else {
      return <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <AppNavigator />
      </View>
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
