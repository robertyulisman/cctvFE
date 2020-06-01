import axios from 'axios';
import {API_URL} from 'react-native-dotenv';
import {store} from '../store';
import {ToastAndroid} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
function getConfig() {
  NetInfo.fetch().then((state) => {
    if (!state.isConnected) {
      ToastAndroid.show('No Internet Connection', ToastAndroid.LONG);
    }
  });
  const config = {};
  const token = store.getState().userData.token;
  if (token) {
    config.headers = {Authorization: `Bearer ${token}`};
  }
  return config;
}

export const getData = async (dataUrl, formData) => {
  try {
    // const url = `http://192.168.100.2:5004/api/` + dataUrl;
    const url = `${API_URL}api/` + dataUrl;

    const response = await axios.get(url, getConfig());
    return response;
  } catch (err) {
    throw err;
  }
};
export const submitData = async (dataUrl, formData) => {
  try {
    const url = `${API_URL}api/` + dataUrl;
    // const url = `http://192.168.100.2:5004/api/` + dataUrl;
    const response = await axios.post(url, formData, getConfig());
    return response;
  } catch (err) {
    throw err;
  }
};

export const patchData = async (dataUrl, formData) => {
  try {
    const url = `${API_URL}api/` + dataUrl;
    // const url = `http://192.168.100.2:5004/api/` + dataUrl;
    const response = await axios.patch(url, formData, getConfig());
    return response;
  } catch (err) {
    throw err;
  }
};
