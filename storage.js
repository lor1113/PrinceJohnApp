import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { createContext } from 'react';

export const LoginContext = createContext("")
export const LogoutContext =  createContext("")
export const StockContext = createContext({})
export const UserContext = createContext({})

export async function saveKey(key, value) {
    await SecureStore.setItemAsync(key, value);
  }
  
export async function getKey(key) {
    return await SecureStore.getItemAsync(key);
}
  
export const storeData = async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      throw new Error(e)
    }
  };
  
export const getData = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      throw new Error(e)
    }
  };
  