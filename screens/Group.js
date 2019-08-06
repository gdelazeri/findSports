import React from 'react';
import {
  ScrollView,
  View,
  FlatList,
  Text,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Platform,
  AsyncStorage,
} from 'react-native';
import { Card, Icon } from 'react-native-elements';
import Styles from '../constants/Styles';
import Colors from '../constants/Colors';
import Message from '../components/Message';
import API from '../services/api';
import Screen from '../components/Screen';

export default class Group extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      refreshing: false,
      loadError: false,
      group: {
        messages: [],
      },
      messageText: '',
    }
  }

  static navigationOptions = ({ navigation }) => ({
    headerTitle: navigation.getParam('title'),
  })

  async componentWillMount() {
    this.groupId = this.props.navigation.getParam('_id');
    this.userId = await AsyncStorage.getItem('userId');
    this.load();
  }

  async load(refreshing = false) {
    this.setState({ refreshing });
    try {
      const group = await API.groupGet(this.groupId);
      this.props.navigation.setParams({
        title: <View>
          <Text style={[Styles.text16, Styles.textBold]}>{group.name}</Text>
          <Text style={Styles.text12}>{group.sport.name}</Text>
        </View>
      });
      this.setState({ group, loadError: false, refreshing: false, loading: false });
      setInterval(() => this.upload(), 5000);
    } catch(error) {
      this.setState({ loadError: true, refreshing: false, loading: false });
    }
  }

  async upload() {
    try {
      const group = await API.groupGet(this.groupId);
      this.setState({ group });
      this.scrollView.scrollToEnd({ animated: true });
    } catch (e) {

    }
  }

  async add() {
    const { messageText } = this.state;
    this.setState({ messageText: '' });
    const group = await API.addMessage(this.groupId, this.userId, messageText);
    this.setState({ group });
    this.scrollView.scrollToEnd({ animated: true });
  }

  reload() {
    this.setState({ loading: true });
    this.load();
  }

  render() {
    return <Screen loading={this.state.loading} navigation={this.props.navigation} error={this.state.loadError} reload={() => this.reload()}>
      <ScrollView
        ref={ref => this.scrollView = ref}
        onContentSizeChange={(contentWidth, contentHeight)=>{        
          this.scrollView.scrollToEnd({animated: true});
        }}
        keyboardShouldPersistTaps='handled' contentContainerStyle={Styles.padding15}
        refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.load(true)} />}
      >
        {this.state.group.messages.map(message => <Message message={message} userId={this.userId} />)}
        {this.state.group.messages.length === 0 && <View>
          <View style={Styles.viewDivider15} />
          <Text style={[Styles.text15, Styles.textCenter]}>Seja o primeiro a enviar uma mensagem neste grupo!</Text>
        </View>}
      </ScrollView>
      <View style={[Styles.topBorder, { backgroundColor: 'white', paddingHorizontal: 15, paddingVertical: 5, marginBottom: this.state.keyboardHeight  }]}>
        <View style={[Styles.inline, Styles.border, { borderRadius: 10 }]}>
          <TextInput
            style={Styles.inputComment}
            value={this.state.messageText}
            onSubmitEditing={() => this.add()}
            placeholder="Digite aqui..."
            placeholderTextColor={Colors.gray}
            returnKeyType="send"
            multiline={true}
            textAlignVertical='center'
            onChangeText={(messageText) => this.setState({ messageText })}
          />
          <TouchableOpacity style={[Styles.center, { width: '15%' }]} onPress={() => this.add()} disabled={this.state.messageText.length === 0}>
            <Icon name='paper-plane' type='font-awesome' color={Colors.green} />
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  }
}

