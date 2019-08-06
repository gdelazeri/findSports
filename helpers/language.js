import React from 'react';
import { AsyncStorage } from 'react-native';
import API from '../services/api';

export default class Language extends React.Component {
  constructor() {
    super();
    this.vocabulary = {};
  }

  async load(update = false) {
    let vocabulary = await AsyncStorage.getItem('vocabulary');
    if (update || !vocabulary) {
      this.userLanguageId = await AsyncStorage.getItem('userLanguageId');
      language = await API.getLanguage(this.userLanguageId);
      if (language)
        language.vocabulary.forEach(v => { this.vocabulary[v.key] = v.text; });
    } else {
      this.vocabulary = JSON.parse(vocabulary);
    }
    await AsyncStorage.setItem('vocabulary', JSON.stringify(this.vocabulary));
  }

  async loadLanguage(languageId) {
    this.userLanguageId = languageId;
    await AsyncStorage.setItem('userLanguageId', this.userLanguageId);
    const language = await API.getLanguage(this.userLanguageId);
    this.vocabulary = {};
    language.vocabulary.forEach(v => { this.vocabulary[v.key] = v.text; });
    await AsyncStorage.setItem('vocabulary', JSON.stringify(this.vocabulary));
  }

  get(key) {
    if (this.vocabulary[key]) {
      return this.vocabulary[key];
    }
    return '';
  }

  render() {
    return null;
  }
}