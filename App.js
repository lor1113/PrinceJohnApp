import React, { useEffect, useState } from 'react';
import {ping, getAccessToken, getStockLiveData, getStockBaseData} from './networkFetcher'
import LoggedView from './LoggedView'
import {BlankScreen, LoadingScreen, ServerDown} from './baseScreens';
import NoLogView from './NoLogView';
import { getData,getKey,saveKey,storeData, LoginContext, UserContext, StockContext, LogoutContext } from './storage';
import { Alert } from 'react-native';

const cleanData = (stockBaseData, stockLiveData) => {
  console.log("cleaning data")
  tempStockData = {}
  for (metaData of stockBaseData) {
    delete metaData.icon
    delete metaData.hasIcon
    tempStockData[metaData.ticker] = metaData
  }
  for (liveData of stockLiveData) {
    tempStockData[liveData.ticker]["delta"] = liveData.delta
    tempStockData[liveData.ticker]["price"] = liveData.price
    tempPriceHistory = Object.entries(liveData.priceHistory).map(([key, value]) => ([key,value]))
    tempPriceHistory.sort()
    tempPriceHistory = tempPriceHistory.map(([a,b]) => b)
    tempStockData[liveData.ticker]["priceHistory"] = tempPriceHistory
  }
  console.log("done cleaning data")
  return tempStockData
}

let accessToken = ""

export default function App() {
  const [stockData, setStockData] = useState({})
  const [userData, setUserData] = useState({})
  const [baseState, setBaseState] = useState("loading")

  async function bootFunction () {
    serverUp = await ping()
    if (!serverUp) {
      setBaseState("noserv")
      return null
    }
    logged = await getData("logged")
    console.log("Logged In: " + logged)
    if (logged == null) {
      logged = false
      storeData("logged",false)
    }
    if (logged == true) {
      initialLogin()
    } else {
      setBaseState("nolog")
    }
  }

  async function login(result) {
    setBaseState("loading")
    if (result.status == 200) {
      body = await result.json()
      newAccessToken = await getAccessToken(body["token"])
      if (newAccessToken) {
        storeData("logged",true)
        saveKey("bearer",body["token"])
        accessToken = newAccessToken
        loadLogin()
      }
    } else {
      setBaseState("nolog")
      Alert.alert("Something failed. You have been logged out.")
    }
  }

  async function initialLogin() {
    refresh = await getKey("bearer")
    newAccessToken = await getAccessToken(refresh)
    if (newAccessToken) {
      accessToken = newAccessToken
      loadLogin()
    } else {
      storeData("logged",false)
      saveKey("bearer","")
      setBaseState("nolog")
      Alert.alert("Something failed. You have been logged out.")
    }
  }

  const logout = () => {
    saveKey("bearer","")
    storeData("logged",false)
    setBaseState("nolog")
  }

  async function loadLogin() {
    newStockMetaData = await getStockBaseData(accessToken)
    newStockLiveData = await getStockLiveData(accessToken)
    newStockData = cleanData(newStockMetaData,newStockLiveData)
    setStockData(newStockData)
    setBaseState("logged")
  }

  useEffect(() => {
    bootFunction()
  }, [])

  if (baseState == "loading") {
    return <LoadingScreen/>
  } else if (baseState == "noserv") {
    return <ServerDown/>
  } else if (baseState == "logged") {
    return (
      <StockContext.Provider value={stockData}>
        <UserContext.Provider value={userData}>
          <LogoutContext.Provider value={logout}>
            <LoggedView/>
          </LogoutContext.Provider>
        </UserContext.Provider>
      </StockContext.Provider>
    )
  } else if (baseState == "nolog") {
    return (
      <LoginContext.Provider value={login}>
        <NoLogView/>
      </LoginContext.Provider>
    )
  } else {
    throw new Error("Invalid baseState")
  }
};