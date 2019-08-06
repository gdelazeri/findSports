
import moment from 'moment'
import {
  Dimensions,
  Platform,
  Linking,
} from 'react-native';

export default class Util {
  static mediaWidthHeight(padding = 0) {
    const { width } = Dimensions.get('window');
    const widthYoutube = 727;
    const heightYoutube = 409;
    const resp = {
      width: width - padding,
      height: ((width - padding)*heightYoutube) / widthYoutube,
    }
    return resp;
  }

  static mediaHeight(width) {
    const widthYoutube = 727;
    const heightYoutube = 409;
    const resp = {
      width: width,
      height: (width*heightYoutube) / widthYoutube,
    }
    return resp;
  }

  static monthName(month) {
    switch (month) {
      case 1: return 'janeiro';
      case 2: return 'fevereiro';
      case 3: return 'março';
      case 4: return 'abril';
      case 5: return 'maio';
      case 6: return 'junho';
      case 7: return 'julho';
      case 8: return 'agosto';
      case 9: return 'setembro';
      case 10: return 'outubro';
      case 11: return 'novembro';
      case 12: return 'dezembro';
    }
  }

  /**
   * Calculate the percentage of progress (return between 0 and 1)
   * @param {*} progress 
   * @param {*} total 
   */
  static calcProgress(progress, total) {
    if (progress === 0 || total === 0) {
      return 0;
    } else if (progress >= total) {
      return 1;
    } else {
      const percent = progress / total;
      return percent < 1 ? percent : 1;
    }
  }

  /**
   * Change the date to time words
   * @param {*} date 
   */
  static getDate(date) {
    if (moment(date).isSame(moment(), 'day')) {
      return 'Hoje';
    } else if (moment(date).isSame(moment().subtract(1, 'day'), 'day')) {
      return 'Ontem';
    } else if (moment(date).isSame(moment().subtract(2, 'day'), 'day')) {
      return 'Anteontem';
    } else if (moment(date).isSame(moment(), 'year')) {
      return moment(date).format('DD/MM/YYYY');
    } else {
      return moment(date).format('DD/MM/YYYY');
    }
  }

  static download() {
    if (Platform.OS === 'ios') {
      Linking.openURL('https://apps.apple.com/br/app/di%C3%A1logos-de-carreira/id1470622568');
    } else {
      Linking.openURL('market://details?id=com.produtive.dialogos');
    }
  }
}
