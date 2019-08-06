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
import { Overlay, Icon } from 'react-native-elements';
import Styles from '../constants/Styles';
import Colors from '../constants/Colors';
import API from '../services/api';
import Screen from '../components/Screen';

export default class Group extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      refreshing: false,
      loadError: false,
      updating: false,
      errorMessage: '',
      sports: [{
        _id: '',
        name: '',
      }],
      group: {
        name: '',
        description: '',
        sportId: '',
      },
    }
  }

  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Novo Grupo',
    headerRight: <TouchableOpacity style={[Styles.paddingR15, Styles.padding10]} onPress={navigation.getParam('save')} activeOpacity={0.7}>
      <Icon name='check' type='material-community' color={Colors.green} />
    </TouchableOpacity>
  })

  async componentWillMount() {
    this.groupId = this.props.navigation.getParam('_id');
    this.sportId = this.props.navigation.getParam('sportId');
    this.userId = await AsyncStorage.getItem('userId');
    this.load();
  }

  async load(refreshing = false) {
    this.setState({ refreshing });
    try {
      const sports = await API.sportList();
      this.props.navigation.setParams({ save: () => this.save() });
      this.setState({ sports, group: { ...this.state.group, sportId: this.sportId || sports[0]._id }, loadError: false, refreshing: false, loading: false });
    } catch(error) {
      this.setState({ loadError: true, refreshing: false, loading: false });
    }
  }

  async save() {
    this.setState({ updating: true });
    try {
      const { group } = this.state;
      let errorMessage = '';
      if (!group.sportId) errorMessage += 'Informe o esporte;'
      if (!group.name) errorMessage += 'Informe o nome do grupo;'
      if (errorMessage.length > 0) {
        this.setState({ errorMessage, updating: false });
      } else {
        const obj = {
          sportId: group.sportId,
          name: group.name,
          description: group.description,
          participantsId: [this.userId],
          adminId: this.userId,
        }
        await API.groupAdd(obj);
        if (this.props.navigation.state.params && this.props.navigation.state.params.onGoBack){
          this.props.navigation.state.params.onGoBack();
        }
        this.props.navigation.goBack();
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
    const { group } = this.state;
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
        <Text style={[Styles.text15, Styles.textLightText]}>Esporte</Text>
        <View style={{ borderBottomColor: Colors.lightText, borderBottomWidth: StyleSheet.hairlineWidth }}>
          <Picker
            selectedValue={this.state.group.sportId}
            style={Styles.picker}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({ group: {...group, sportId: itemValue } })
            }>
              {this.state.sports.map(sport => <Picker.Item label={sport.name} value={sport._id} />)}
          </Picker>
        </View>
        <View style={Styles.viewDivider15} />
        <Text style={[Styles.text15, Styles.textLightText]}>Nome</Text>
        <TextInput
          underlineColorAndroid={Colors.background}
          style={Styles.inputTopic}
          numberOfLines={1}
          placeholder='Nome do grupo'
          placeholderTextColor={Colors.gray}
          value={group.name}
          onChangeText={(name) => this.setState({ group: {...group, name } })}
        />
        <View style={Styles.viewDivider15} />
        <Text style={[Styles.text15, Styles.textLightText]}>Descrição</Text>
        <TextInput
          underlineColorAndroid={Colors.background}
          style={Styles.inputTopic}
          multiline={true}
          placeholder='Descrição do grupo'
          placeholderTextColor={Colors.gray}
          value={group.description}
          onChangeText={(description) => this.setState({ group: {...group, description } })}
        />
      </ScrollView>
    </Screen>
  }
}

