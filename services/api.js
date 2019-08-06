const endpoint = 'https://findsportsapi.herokuapp.com';

const toInput = (obj) => {
  const getValue = (value) => {
    if (value === null || value === undefined) return 'null';
    else if (typeof value === 'string') return `"${value}"`;
    else if (typeof value === 'number') return `${value}`;
    else if (typeof value === 'boolean') return `${value}`;
    else if (Array.isArray(value))  return `[${toInput(value)}]`;
    else if (typeof value === 'object') return `{${toInput(value)}}`;
    return null
  }
  let body = '';
  const fields = Object.keys(obj);
  fields.map((field, idx) => {
    body += idx > 0 ? ',' : '';
    body += `${field}: ${getValue(obj[field])}`;
  });
  return body;
}

export default class API {
  static async sleep(ms) {
    return new Promise(resolve=> setTimeout(resolve,ms))
  }

  static slashNtoHash(text) {
    const setCharAt = (str, index, char) => {
      if(index > str.length-1)
        return str;
      return str.substr(0,index) + char + str.substr(index+2);
    }
    for (let i = 0; i < text.length/3; i += 1) {
      if (text.substr(i,2) === "\\n") {
        text = setCharAt(text, i, "#");
      }
    }
    return text;
  }
  
  static hashToSlashN(text) {
    const setCharAt = (str, index, char) => {
      if(index > str.length-1)
        return str;
      return str.substr(0,index) + char + str.substr(index+1);
    }
    for (let i = 0; i < text.length; i += 1) {
      if (text[i] === '#') {
        text = setCharAt(text, i, "\n");
      }
    }
    return text;
  }

  static async login(email, password) {
    const resp = await API.query('user', 'login', `email: "${email}", password: "${password}"`, '_id, name, email');
    return resp;
  }

  static async listUsers() {
    const resp = await API.query('user', 'list', '', '_id, name, email');
    return resp;
  }

  static async userAdd(user) {
    const resp = await API.mutation('user', 'add', `user: {${toInput(user)}}`, '_id, name, email');
    return resp;
  }
  
  static async groupAdd(group) {
    const obj = `sportId: "${group.sportId}",name: "${group.name}",description: "${group.description}",participantsId: ["${group.adminId}"],adminId: "${group.adminId}"`;
    const resp = await API.mutation('group', 'add', `group: {${obj}}`, '_id');
    return resp; 
  }

  static async groupEdit(group) {
    const resp = await API.mutation('group', 'edit', `group: {${toInput(group)}}`, '_id');
    return resp; 
  }

  static async groupRemove(groupId) {
    const resp = await API.mutation('group', 'remove', `_id: "${groupId}"`, undefined);
    return resp; 
  }
  
  static async groupList(sportId) {
    let query = undefined;
    if (sportId) {
      query = `sportId: "${sportId}"`;
    }
    const resp = await API.query('group', 'list', query, '_id, name, description, sportId, participantsId, adminId, admin { name }, createdAt');
    return resp;
  }
  
  static async groupGet(groupId) {
    const resp = await API.query('group', 'get', `_id: "${groupId}"`, '_id, name, description, sportId, adminId, sport { name }, participantsId, messages { userId, user { name }, text, date }');
    return resp;
  }
  
  static async addMessage(groupId, userId, text) {
    const resp = await API.mutation('group', 'addMessage', `groupId: "${groupId}", userId: "${userId}", text: "${text}"`, '_id, name, description, sportId, participantsId, messages { userId, user { name }, text, date }');
    return resp;
  }

  static async sportList() {
    const resp = await API.query('sport', 'list', undefined, '_id, name, image');
    return resp;
  }

  static async sportGet(_id) {
    const resp = await API.query('sport', 'get', `_id: "${_id}"`, '_id, name, image');
    return resp;
  }

  static async query(path, method, query, fields, isDebug = false) {
    try {
      const response = await fetch(`${endpoint}/${path}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `query{${method} ${query ? `(${query})` : ''} ${fields ? `{${fields}}` : ''}}`,
        }),
      });
      if (isDebug) { alert(JSON.stringify(response)) }
      return JSON.parse(response['_bodyText']).data[method];
    } catch (error) {
      throw error;
    }
  }

  static async mutation(path, method, bodyString, fields, isDebug = false) {
    try {
      const response = await fetch(`${endpoint}/${path}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `mutation{${method} (${bodyString}) ${fields ? `{${fields}}` : ''}}`,
        }),
      });
      if (isDebug) { alert(JSON.stringify(response)) }
      return JSON.parse(response['_bodyText']).data[method];
    } catch (error) {
      throw error;
    }
  }
}