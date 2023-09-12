import React, { useEffect, useState } from 'react';
import {
  Text,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import StocksTabView from './StocksTabView';
import ping from './networkFetcher'


const TabBottom = createBottomTabNavigator();

const token = "eyJlbmMiOiJBMTI4R0NNIiwiYWxnIjoiUlNBLU9BRVAtMjU2In0.PXIN3QmNe-sT3GMwenZlnMLV32Fpj-z-34bzKvdzE4zBv_ZxQ3eYhnGNUYwoahNQ3Zcn0aFFkRsCCIUYUgQVY4_TGA8LRWGqkc7Ig_3tpttp0sj4gVWvxH3Z7yoRokxPJ7RsePQN4LOmXHDC_b8mJDg2pm5n5OvqOuu3j3LD-9tX9p8tGk49Az8hwa5I_e7x0NApJKoMEovTN0lsU_ajoVXhdycCi4emAyGh_Vq-OWr1LhoD2Uq6Bxy2ANCYpvaORlQFSZtpZlmgn5PzXsNoxh-shU3nF7b6RB760h-U2zkD7GcH_UciS67mFm5eCm_PISpPg3HA80xwtsMw0ywt9A.F1hzVb7Okcudrclz.YGYBcH-gRQ4iVK5xhYAKdN18Wz4cuCPw9AYnoc_XMTY2xbBTHnZKMLouc-A1kw9udJ9vKu3pUbIL4QM8Z2sLvdXKet0HNjQGR94hG8WP-Xg8M2Dfx0wuLTGJFb54XGDHNjnMM2Y96DVAD4O-gVKn23Kog0972-BK6jVwF4eKKqT45ceS3XLVz7Jlrtccz17t5fs1yxPR_6IJRz42qAKqlh06U4UlvMxUDIDvkz-KeEQs72q1evfGgmGY6EosJX61IOQlpnHVg8zWxG6I6HqLI-IkB1RhuRXwCbfuXA._s_i7d1Q6okyV4ASKSsKrQ"

async function save(key, value) {
  await SecureStore.setItemAsync(key, value);
}

const LoggedInView = ({stockData}) => {
  if (Object.keys(stockData).length === 0) {
    return <Text>Loading</Text>
  }
  return (
    <TabBottom.Navigator>
      <TabBottom.Screen name="Stock Market" component={StocksTabView} initialParams={{"stockData":stockData}}/>
      <TabBottom.Screen name="Portfolio" component={UserPortfolio}/>
      <TabBottom.Screen name="Profile" component={UserProfile}/>
    </TabBottom.Navigator>
  )
}

async function getValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    return result
  } else {
    throw new Error("Token not found")
  }
}

const UserProfile = () => {
  return <Text>User Profile</Text>
}

const UserPortfolio = () => {
  return <Text>User Portfolio</Text>
}

export default function App() {
  const [stockData, setStockData] = useState({})
  const [userData, setUserData] = useState({})

  const fetchJson = () => {
    const stockLiveData = require('./stockData.json');
    const stockMetaData = require('./stockMetaData.json');
    tempStockData = {}
    for (let metaData of stockMetaData) {
      delete metaData.icon
      delete metaData.hasIcon
      tempStockData[metaData.ticker] = metaData
    }
    for (let liveData of stockLiveData) {
      tempStockData[liveData.ticker]["delta"] = liveData.delta
      tempStockData[liveData.ticker]["price"] = liveData.price
      tempPriceHistory = Object.entries(liveData.priceHistory).map(([key, value]) => ([key,value]))
      tempPriceHistory.sort()
      tempPriceHistory = tempPriceHistory.map(([a,b]) => b)
      tempStockData[liveData.ticker]["priceHistory"] = tempPriceHistory

    }
    tempStockData = Object.entries(tempStockData).map(([key, value]) => (value))
    setStockData(tempStockData)
  }
  useEffect(() => {
    ping().then((x) => console.log(x))
    fetchJson()
    getValueFor("bearer-access")
  }, [])
  return(
    <NavigationContainer>
      <LoggedInView stockData={stockData}/>
    </NavigationContainer>
  ) 
};