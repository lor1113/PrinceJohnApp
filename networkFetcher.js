const ipAddr = "https://princejohn.eu:8080/appEndpoint/"



const prepHeaders = () => {
    return {
        'Content-Type': 'application/json',
        "X-Operation-Timestamp": Math.floor(Date.now() / 1000),
        "X-Operation-Id": Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER - 10)) + 1
    }
}

export const sendNewLoginRequest = (email,password,totp) => {
    newHeaders = prepHeaders()
    newHeaders["X-User-email"] =  email
    newHeaders["X-User-password"] = password
    if (totp) {
        newHeaders["X-User-TOTP"] = totp
    }
    loginDeviceID = Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER - 10)) + 1
    output = {
        "loginDeviceID": loginDeviceID
    }
    newLoginRequest = {
        "email":email,
        "loginDeviceID":loginDeviceID
    }
    return fetch(ipAddr + "s4/requestNewLogin", {
        method: 'POST',
        headers: newHeaders,
        body: JSON.stringify(newLoginRequest)
    })
    .then(response => response.status)
    .then(status => {output["status"] = status; return output})
    .catch(error => {
        console.error(error);
      });
}

export const newLogin = (email,password,loginDeviceID) => {
    newHeaders = prepHeaders()
    newHeaders["X-User-email"] =  email
    newHeaders["X-User-password"] = password
    output = {}
    newLoginBody = {
        "email":email,
        "loginDeviceID":loginDeviceID,
        "secret":"secret",
        "operation_id":newHeaders["X-Operation-Id"]
    }
    return fetch(ipAddr + "s4/newLogin", {
        method: 'POST',
        headers: newHeaders,
        body: JSON.stringify(newLoginBody)
    })
    .catch(error => {
        console.error(error);
      });
}

export const sendSignupRequest = (username, email, password, birthday) => {
    loginDeviceID = Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER - 10)) + 1
    newUserBody = {
        "email":email,
        "loginDeviceID":loginDeviceID,
        "username":username,
        "password":password,
        "birthday":birthday
    }
    return fetch(ipAddr + "s0/userSignup", {
        method: 'POST',
        headers: prepHeaders(),
        body:JSON.stringify(newUserBody)
    })
    .then(response => {
        if (response.status == 200) {
            return loginDeviceID
        } else {
            return false
        }
    })
}

export const getAccessToken = (refresh) => {
    newHeaders = prepHeaders()
    newHeaders["bearer"] = refresh
    return fetch(ipAddr + "s2/accessToken", {
        method: 'POST',
        headers: newHeaders,
    })
    .then(response => {
        if (response.status == 200) {
            return response.text()
        } else {
            return false
        }
    })
    .catch(error => {
        console.error(error);
      });

}

export const getStockBaseData = (access) => {
    url = ipAddr+'s1/stockBaseData'
    newHeaders = prepHeaders()
    newHeaders["bearer"] = access
    return fetch(url, {
        method: 'GET',
        headers: newHeaders
      })
    .then(response => response.json())
    .catch(error => {
      console.error(error);
    });
}

export const getStockLiveData = (access) => {
    url = ipAddr+'s1/stockData'
    newHeaders = prepHeaders()
    newHeaders["bearer"] = access
    return fetch(url, {
        method: 'GET',
        headers: newHeaders
      })
    .then(response => response.json())
    .catch(error => {
      console.error(error);
    });
}

export async function ping () {
    try {
        url = ipAddr+'ping'
        const response = await fetch(url)
        if (response.status == 200) {
            return true
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}


