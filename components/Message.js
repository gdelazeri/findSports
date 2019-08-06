import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import moment from 'moment';
import Styles from '../constants/Styles';
import Colors from '../constants/Colors';

const colorMe = '#dcf8c6';
const colorYours = '#ffffff';

export default class Message extends React.Component {
  render() {
    if (this.props.userId === this.props.message.userId)
      return <View style={[Styles.inline, Styles.marginB5]}>
        <View style={{ width: '25%' }}></View>
        <View style={{ width: '75%' }}>
          <View style={{ paddingHorizontal: 10, paddingVertical: 5, backgroundColor: colorMe, borderRadius: 10 }}>
            <Text style={Styles.text14}>{this.props.message.text}</Text>
            <Text style={[Styles.text10, { textAlign: 'right', color: Colors.lightText }]}>{moment(this.props.message.date).format('DD/MM')}</Text>
          </View>
        </View>
      </View>
    else 
      return <View style={[Styles.inline, Styles.marginB5]}>
        <View style={{ width: '75%' }}>
          <View style={{ paddingHorizontal: 10, paddingVertical: 5, backgroundColor: colorYours, borderRadius: 10 }}>
            <Text style={[Styles.text14, Styles.textBold]}>{this.props.message.user ? this.props.message.user.name : ''}</Text>
            <Text style={Styles.text14}>{this.props.message.text}</Text>
            <Text style={[Styles.text10, { textAlign: 'right', color: Colors.lightText }]}>{moment(this.props.message.date).format('DD/MM')}</Text>
          </View>
        </View>
        <View style={{ width: '25%' }}></View>
      </View>
  }
}

