import React from 'react';
import { View, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import CustomButton from '../components/CustomButton';
import Colors from '../constants/Colors';
import Styles from '../constants/Styles';

export default class Screen extends React.Component {
  renderError() {
    return <View style={Styles.viewCenter}>
      <Text style={[Styles.text16, Styles.textCenter]}>Ops, ocorreu um erro ao carregar as informações</Text>
      <View style={Styles.viewDivider15} />
      <View style={Styles.viewDivider15} />
      {this.props.reload !== undefined && <CustomButton
        width={'70%'}
        buttonStyle={Styles.btnBorder}
        textStyle={{ color: Colors.primaryColor }}
        onPress={() => this.props.reload()}
        title='TENTAR NOVAMENTE'
      />}
      <View style={Styles.viewDivider15} />
      <TouchableOpacity activeOpacity={0.7} onPress={() => this.props.navigation.goBack()} style={{ width: '70%' }}>
        <Text style={[Styles.text15, Styles.textCenter]}>VOLTAR</Text>
      </TouchableOpacity>
    </View>
  }

  render() {
    return <View style={{ height: '100%' }}>
      {this.props.loading && <View style={Styles.viewCenter}><ActivityIndicator size="large" color={Colors.lightText} /></View>}
      {!this.props.loading && this.props.error && this.renderError()}
      {!this.props.loading && !this.props.error && this.props.children}
    </View>
  }
}
