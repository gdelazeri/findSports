import React from 'react';
import {
  AsyncStorage,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Text, Overlay } from 'react-native-elements';
import Screen from '../components/Screen';
import Styles from '../constants/Styles';
import Colors from '../constants/Colors';
import API from '../services/api';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      loginLoading: false,
      email: '',
      password: '',
    }
  }

  static navigationOptions = {
    headerLeft: null,
    headerTitle: 'Entrar',
  }

  async componentWillMount() {
    const userId = await AsyncStorage.getItem('userId');
    if (userId) {
      AsyncStorage.clear();
      this.props.navigation.navigate('Home');
    } else {
      this.setState({ loading: false });
    }
  }

  async login() {
    this.setState({ loginLoading: true });
    const { email, password } = this.state;
    if (email && password) {
      const user = await API.login(email.toLowerCase(), password);
      if (user) {
        await AsyncStorage.setItem('userId', user._id);
        await AsyncStorage.setItem('userName', user.name);
        await AsyncStorage.setItem('userEmail', user.email.toLowerCase());
        this.props.navigation.navigate('Home');
        this.setState({ loginLoading: false });
        return;
      }
    }
    this.setState({ loading: false, loginLoading: false });
  }
  
  renderModalLoading() {
    return <Overlay width={100} height={100} overlayStyle={Styles.padding0} isVisible={this.state.loginLoading}>
      <View style={Styles.viewCenter}>
        <ActivityIndicator size="large" color={Colors.primaryColor} />
      </View>
    </Overlay>
  }

  render() {
    return (
      <Screen navigation={this.props.navigation}>
        {this.renderModalLoading()}
        <ScrollView contentContainerStyle={Styles.padding15}>
          <View style={Styles.viewDivider15} />
          <Text style={[Styles.text17, Styles.textCenter]}>Acessar com e-mail</Text>
          <View style={Styles.viewDivider} />
          <Text style={[Styles.text16, Styles.textBold, Styles.marginB5, { color: Colors.defaultText }]}>E-mail</Text>
          <TextInput
            style={Styles.inputLogin}
            onChangeText={(email) => this.setState({ email })}
            value={this.state.email}
            placeholder='Digite o e-mail'
            placeholderTextColor={Colors.gray}
            keyboardType='email-address'
          />
          <View style={Styles.viewDivider} />
          <Text style={[Styles.text16, Styles.textBold, Styles.marginB5, { color: Colors.defaultText }]}>Senha</Text>
          <TextInput
            style={Styles.inputLogin}
            onChangeText={(password) => this.setState({ password })}
            value={this.state.password}
            placeholder='Digite a senha'
            placeholderTextColor={Colors.gray}
            keyboardType='visible-password'
          />
          <View style={Styles.viewDivider15} />
          <View style={Styles.viewDivider15} />
          <TouchableOpacity activeOpacity={0.7} style={[Styles.center, { padding: 15, borderRadius: 4, backgroundColor: Colors.primaryColor }]} onPress={() => this.login()}>
            <Text style={[Styles.text16, Styles.textCenter, Styles.textBold, { color: 'white' }]}>ENTRAR</Text>
          </TouchableOpacity>
          <View style={Styles.viewDivider} />
          <TouchableOpacity activeOpacity={0.7} style={[Styles.center, { padding: 15, borderRadius: 4, borderWidth: 1, borderColor: Colors.primaryColor }]} onPress={() => this.props.navigation.navigate('Register')}>
            <Text style={[Styles.text16, Styles.textCenter, Styles.textBold, { color: Colors.primaryColor }]}>CADASTRE-SE</Text>
          </TouchableOpacity>
        </ScrollView>
      </Screen>
    );
  }
}
