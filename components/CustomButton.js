import React from 'react';
import { Button } from 'react-native-elements'
import Colors from '../constants/Colors'
import Styles from '../constants/Styles'

export default class CustomButton extends React.Component {
  render() {
    const width = this.props.width || '100%';
    const height = this.props.height || 40;
    const textStyle = {
      ...Styles.textBold,
      textAlign: 'center',
      fontSize: 15,
      ...this.props.textStyle,
    };
    const buttonStyle = {
      height,
      borderRadius: 20,
      width: '100%',
      backgroundColor: 'transparent',
      ...this.props.buttonStyle,
    };
    const containerViewStyle = {
      height,
      width,
      marginLeft: 0,
      marginRight: 0,
      ...this.props.containerViewStyle,
    };
    return <Button
      loadingProps={{ color: this.props.textStyle.color || Colors.defaultText }}
      loading={this.props.loading}
      icon={this.props.icon}
      onPress={this.props.onPress}
      title={this.props.title}
      titleStyle={textStyle}
      buttonStyle={buttonStyle}
      containerStyle={containerViewStyle}
      disabled={this.props.disabled}
    />
  }
}