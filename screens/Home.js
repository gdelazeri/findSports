import React from 'react';
import {
  ScrollView,
  Dimensions,
  View,
  Image,
  FlatList,
  Text,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Card, Icon } from 'react-native-elements';
import Styles from '../constants/Styles';
import Colors from '../constants/Colors';
import API from '../services/api';
import Screen from '../components/Screen';

const { width } = Dimensions.get('window');

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      refreshing: false,
      loadError: false,
      sports: [],
      groups: [],
    }
  }

  static navigationOptions = ({ navigation }) => ({
    headerLeft: null,
    headerTitle: 'Esportes',
    headerRight: <TouchableOpacity style={[Styles.paddingR15, Styles.padding10]} onPress={navigation.getParam('groupAdd')} activeOpacity={0.7}>
      <Icon name='plus' type='material-community' color={Colors.green} />
    </TouchableOpacity>,
  })

  async componentWillMount() {
    this.load();
  }

  groupAdd() {
    this.props.navigation.navigate('GroupAdd', { onGoBack: () => this.load() });
  }

  async load(refreshing = false) {
    this.setState({ refreshing });
    try {
      this.props.navigation.setParams({ groupAdd: () => this.groupAdd() });
      const sports = await API.sportList();
      const groups = await API.groupList();
      this.setState({ sports, groups, loadError: false, refreshing: false, loading: false });
    } catch(error) {
      this.setState({ loadError: true, refreshing: false, loading: false });
    }
  }

  reload() {
    this.setState({ loading: true });
    this.load();
  }

  render() {
    const widthCard = (width-45)/2;
    return <Screen loading={this.state.loading} navigation={this.props.navigation} error={this.state.loadError} reload={() => this.reload()}>
      <ScrollView
        keyboardShouldPersistTaps='handled' contentContainerStyle={Styles.padding15}
        refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.load(true)} />}
      >
        <FlatList
          data={this.state.sports}
          keyExtractor={(item) => item._id}
          numColumns={2}
          renderItem={({item, index}) => {
            const groups = this.state.groups.filter(g => g.sportId === item._id);
            const image = item.image ? { uri: item.image } : require('../assets/images/icon.png');
            return <TouchableOpacity style={{ marginRight: index % 2 === 0 ? 15 : 0 }} activeOpacity={0.7} onPress={() => this.props.navigation.navigate('GroupList', { sportId: item._id, onGoBack: () => this.load() })}>
              <Card containerStyle={[Styles.card, { width: widthCard, padding: 0, overflow: 'hidden' }]}>
                <Image
                  style={{ width: widthCard, height: widthCard }} resizeMode="cover"
                  source={image}
                />
                <View style={Styles.padding10}>
                  <Text style={[Styles.text18, Styles.textBold, Styles.marginB5]} numberOfLines={1}>{item.name}</Text>
                  <Text style={[Styles.text15, { color: Colors.lightText }]}>{groups.length} grupo{groups.length > 1 ? 's' : ''}</Text>
                </View>
              </Card>
            </TouchableOpacity>
          }}
          ItemSeparatorComponent={() => <View style={Styles.viewDivider15} />}
          ListEmptyComponent={() => <View>
            <Text style={Styles.textEmpty}>Nenhum esporte disponível</Text>
          </View>}
        />
      </ScrollView>
    </Screen>
  }
}

