import React from 'react';
import { TouchableOpacity, Platform } from 'react-native';
import { Icon } from 'react-native-elements';
import { SafeAreaView, createStackNavigator } from 'react-navigation';

import Register from '../screens/Register';
import Home from '../screens/Home';
import Group from '../screens/Group';
import GroupAdd from '../screens/GroupAdd';
import GroupList from '../screens/GroupList';
import Login from '../screens/Login';

import Colors from '../constants/Colors';
import Styles from '../constants/Styles';

if (Platform.OS === 'android') {
  SafeAreaView.setStatusBarHeight(0);
}

export default createStackNavigator({
  Login,
  Home,
  GroupList,
  Group,
  GroupAdd,
  Register,
}, {
  initialRouteKey: 'Login',
  defaultNavigationOptions: ({ navigation }) =>  {
    return ({
      headerStyle: { elevation: 1, shadowOpacity: 1 },
      headerTitleStyle: { color: Colors.defaultText, fontWeight: 'bold' },
      headerLeft: <TouchableOpacity style={[Styles.paddingL15, Styles.padding10]} onPress={() => { 
        navigation.state.params && navigation.state.params.onGoBack ? navigation.state.params.onGoBack() : undefined,
        navigation.goBack();
      }} activeOpacity={0.7}>
        <Icon name='arrow-left' type='material-community' color={Colors.defaultText} />
      </TouchableOpacity>
    })},
  cardStyle: {
    backgroundColor: Colors.background,
  }
});
