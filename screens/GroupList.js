import React from 'react';
import {
  ScrollView,
  View,
  FlatList,
  Text,
  Image,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
  AsyncStorage,
  Alert,
} from 'react-native';
import { Card, Icon } from 'react-native-elements';
import moment from 'moment';
import Styles from '../constants/Styles';
import Colors from '../constants/Colors';
import API from '../services/api';
import Screen from '../components/Screen';
import CustomButton from '../components/CustomButton';

const { width } = Dimensions.get('window');

export default class GroupList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      refreshing: false,
      loadError: false,
      groups: [],
      sport: {},
    }
  }

  static navigationOptions = ({ navigation }) => ({
    headerTitle: navigation.getParam('title'),
    headerRight: <TouchableOpacity style={[Styles.paddingR15, Styles.padding10]} onPress={navigation.getParam('groupAdd')} activeOpacity={0.7}>
      <Icon name='plus' type='material-community' color={Colors.green} />
    </TouchableOpacity>,
  });

  async componentWillMount() {
    this.sportId = this.props.navigation.getParam('sportId');
    this.userId = await AsyncStorage.getItem('userId');
    this.load();
  }

  groupAdd() {
    this.props.navigation.navigate('GroupAdd', { sportId: this.props.navigation.getParam('sportId'), onGoBack: () => this.load() });
  }

  async groupRemove(groupId) {
    Alert.alert(
      'Excluir grupo',
      'Deseja realmente excluir este grupo?',
      [
        { text: 'CANCELAR', onPress: () => { }},
        { text: 'SIM', onPress: async () => {
          await API.groupRemove(groupId);
          this.load(true);
        }},
      ],
      { cancelable: true },
    );
  }

  async load(refreshing = false) {
    this.setState({ refreshing });
    try {
      const sport = await API.sportGet(this.sportId);
      this.props.navigation.setParams({ title: `Grupos de ${sport.name}`, groupAdd: () => this.groupAdd() });
      const groups = await API.groupList(this.sportId);
      this.setState({ groups, sport, loadError: false, refreshing: false, loading: false });
    } catch(error) {
      this.setState({ loadError: true, refreshing: false, loading: false });
    }
  }

  reload() {
    this.setState({ loading: true });
    this.load();
  }

  render() {
    const image = this.state.sport.image ? { uri: this.state.sport.image } : undefined;
    return <Screen loading={this.state.loading} navigation={this.props.navigation} error={this.state.loadError} reload={() => this.reload()}>
      <ScrollView
        keyboardShouldPersistTaps='handled'
        refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.load(true)} />}
      >
        <Image style={{ width: width, height: width/2 }} resizeMode="cover" source={image} />
        <FlatList
          contentContainerStyle={Styles.padding15}
          data={this.state.groups}
          keyExtractor={(item) => item._id}
          renderItem={({item}) => <TouchableOpacity activeOpacity={0.7} onPress={() => this.props.navigation.navigate('Group', { _id: item._id, onGoBack: () => this.load() })}>
            <Card containerStyle={Styles.card}>
              <View style={[Styles.inline, Styles.spaceBetween]}>
                <Text style={[Styles.text17, Styles.textBold]}>{item.name}</Text>
                {this.userId === item.adminId && <TouchableOpacity onPress={() => this.groupRemove(item._id)} activeOpacity={0.7}>
                  <Icon name='trash-can-outline' type='material-community' color={Colors.red} size={22} />
                </TouchableOpacity>}
              </View>
              <Text style={[Styles.text12, Styles.marginB5, { color: Colors.lightText }]}>{item.admin ? `Criado por ${item.admin.name} em ${moment(item.createdAt).format('DD/MM/YYYY')}` : ''}</Text>
              <Text style={[Styles.text15, { color: Colors.lightText }]}>{item.description}</Text>
            </Card>
          </TouchableOpacity>}
          ItemSeparatorComponent={() => <View style={Styles.viewDivider15} />}
          ListEmptyComponent={() => <View style={Styles.center}>
            <View style={Styles.viewDivider15} />
            <Text style={[Styles.text15, Styles.textCenter]}>Nenhum grupo para este esporte</Text>
            <View style={Styles.viewDivider15} />
            <View style={Styles.viewDivider15} />
            <CustomButton
              width={'70%'}
              buttonStyle={Styles.btnBorderGreen}
              textStyle={{ color: Colors.green }}
              onPress={() => this.groupAdd()}
              title='CRIAR GRUPO'
            />
          </View>}
        />
      </ScrollView>
    </Screen>
  }
}

