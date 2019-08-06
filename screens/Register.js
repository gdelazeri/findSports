import React from 'react';
import {
  ScrollView,
  View,
  Picker,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Keyboard,
  ActivityIndicator,
  AsyncStorage,
} from 'react-native';
import { Overlay } from 'react-native-elements';
import Styles from '../constants/Styles';
import Colors from '../constants/Colors';
import API from '../services/api';
import Screen from '../components/Screen';

export default class Group extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      updating: false,
      refreshing: false,
      loadError: false,
      errorMessage: '',
      name: '',
      email: '',
      password: '',
    }
  }

  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Cadastre-se',
  })

  async componentWillMount() {
    this.load();
  }

  async save() {
    this.setState({ updating: true });
    try {
      const { name, email, password } = this.state;
      let errorMessage = '';
      if (!name) errorMessage += 'Informe seu nome;'
      if (!email) errorMessage += 'Informe seu e-mail;'
      if (!password) errorMessage += 'Informe a sua senha;'
      if (errorMessage.length > 0) {
        this.setState({ errorMessage, updating: false });
      } else {
        const obj = {
          name,
          email: email.toLowerCase(),
          password,
        }
        const user = await API.userAdd(obj);
        await AsyncStorage.setItem('userId', user._id);
        await AsyncStorage.setItem('userName', user.name);
        await AsyncStorage.setItem('userEmail', user.email);
        this.props.navigation.navigate('Home');
        this.setState({ updating: false });
      }
    } catch (e) {
      this.setState({ updating: false });
    }
  }

  renderModalLoading() {
    return <Overlay width={100} height={100} overlayStyle={Styles.padding0} isVisible={this.state.updating}>
      <View style={Styles.viewCenter}>
        <ActivityIndicator size="large" color={Colors.primaryColor} />
      </View>
    </Overlay>
  }

  render() {
    return <Screen loading={this.state.loading} navigation={this.props.navigation}>
      {this.renderModalLoading()}
      <ScrollView
        keyboardShouldPersistTaps='handled' contentContainerStyle={Styles.padding15}
      >
         {this.state.errorMessage > 0 && <View style={[Styles.marginB15, Styles.padding10, { backgroundColor: Colors.red, borderRadius: 5 }]}>
          {this.state.errorMessage.split(';').map(err => { if (err) {
            return <Text style={[Styles.text15, Styles.textBold, Styles.textCenter, { color: 'white' }]}>{this.state.errorMessage}</Text>
          }})}
        </View>}
        <Text style={[Styles.text15, Styles.textLightText]}>Nome</Text>
        <TextInput
          underlineColorAndroid={Colors.background}
          style={Styles.inputTopic}
          numberOfLines={1}
          placeholder='Seu nome'
          placeholderTextColor={Colors.gray}
          value={this.state.name}
          onChangeText={(name) => this.setState({ name })}
        />
        <View style={Styles.viewDivider15} />
        <Text style={[Styles.text15, Styles.textLightText]}>E-mail</Text>
        <TextInput
          underlineColorAndroid={Colors.background}
          style={Styles.inputTopic}
          multiline={true}
          autoCapitalize={'none'}
          placeholder='Seu e-mail'
          placeholderTextColor={Colors.gray}
          value={this.state.email}
          onChangeText={(email) => this.setState({ email })}
        />
        <View style={Styles.viewDivider15} />
        <Text style={[Styles.text15, Styles.textLightText]}>Senha</Text>
        <TextInput
          underlineColorAndroid={Colors.background}
          style={Styles.inputTopic}
          multiline={true}
          placeholder='Sua senha'
          placeholderTextColor={Colors.gray}
          value={this.state.password}
          onChangeText={(password) => this.setState({ password })}
        />
        <View style={Styles.viewDivider15} />
        <TouchableOpacity activeOpacity={0.7} style={[Styles.center, { padding: 15, borderRadius: 4, borderWidth: 1, borderColor: Colors.primaryColor }]} onPress={() => this.save()}>
          <Text style={[Styles.text16, Styles.textCenter, Styles.textBold, { color: Colors.primaryColor }]}>CONCLUIR</Text>
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  }
}

