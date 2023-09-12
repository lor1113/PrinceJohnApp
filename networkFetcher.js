import * as SecureStore from 'expo-secure-store';
import axios from 'axios'

const ipAddr = "https://192.168.0.3:8080/appEndpoint/"

async function getValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    return result
  } else {
    throw new Error("Token not found")
  }
}


const prepHeaders = () => {
    return {
        "X-Operation-Timestamp": Math.floor(Date.now() / 1000),
        "X-Operation-Id": Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER - 10)) + 1
    }
}

const getStockMetaData = (date = false) => {
    if (date) {
        url = ipAddr+'/appEndpoint/S1/StockMetaData/' + date
    } else {
        url = ipAddr+'/appEndpoint/S1/StockMetaData'
    }
    newHeaders = prepHeaders()
    newHeaders["bearer"] = getValueFor("bearer-access")
    return fetch(url, {
        method: 'GET',
        headers: prepHeaders()
      })
    .then(response => response.json())
    .catch(error => {
      console.error(error);
    });
}

async function ping () {
    try {
        url = ipAddr+'ping'
        console.log(url, {
            method:'GET'
        })
        const response = await axios.get(url)
        if (response.status == 200) {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.error(error.request?._response)
        return false
    }
}

export default ping


