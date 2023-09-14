import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState, useContext, useEffect } from 'react';
import {Text, View, StyleSheet, Pressable, Dimensions, TextInput, Alert, BackHandler, ScrollView} from 'react-native';
import {newLogin, sendNewLoginRequest, sendSignupRequest} from './networkFetcher';
import { LoadingScreen } from './baseScreens';
import { LoginContext } from './storage';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

const mainButtonHeight = Dimensions.get('window').height * 0.2
const mainButtonWidth = Dimensions.get('window').width * 0.8

const styles = StyleSheet.create({
    loginTopView:{
        justifyContent: 'center',
        alignItems:'center',
        marginTop:-200,
        flex:1
    },
    signupTopView: {
        justifyContent: 'center',
        alignItems:'center'
    },
    loginEntryView: {
        width: mainButtonWidth,
        borderWidth:3,
        borderRadius:7,
        padding:5,
        paddingLeft:10,
        borderColor:'lightblue',
        margin:10
    },
    loginTextInput:{
        borderWidth:3,
        borderRadius:7,
        padding:5,
        paddingLeft:10,
        borderColor:'black'
    },
    loginTextTitle:{
        fontSize:20,
        paddingBottom:10,
        paddingTop:5
    },
    mainButton :{
        height: mainButtonHeight,
        width: mainButtonWidth,
        backgroundColor: 'lightblue',
        margin:10,
        borderRadius:35
    },
    mainView:{
        justifyContent: 'center',
        alignItems:'center',
        flex:1
    },
    mainButtonText:{
        textAlignVertical: "center",
        textAlign: 'center',
        flex:1,
        fontSize:40
    },
    loginButtonText: {
        textAlign: 'center',
        fontSize:30
    },
    loginButtonEnabled: {
        backgroundColor:'lightblue',
        borderRadius:7,
        width: mainButtonWidth,
        position: 'absolute',
        bottom: 90
    },
    loginButtonDisabled: {
        backgroundColor:'lightgrey',
        borderRadius:7,
        width: mainButtonWidth,
        position: 'absolute',
        bottom: 90
    },
    mainText :{
        fontSize:40
    },
    loginConfirmText :{
        width: mainButtonWidth,
        borderColor:'black',
        textAlign:'center',
        borderRadius:7,
        borderWidth:3,
        fontSize:20
    },
    loginConfirmButton: {
        backgroundColor:'lightblue',
        borderRadius:7,
        marginTop:100,
        width: mainButtonWidth,
    },
    birthdayButtonNP: {
        backgroundColor:'red',
        borderRadius:7,
        width: mainButtonWidth,
        marginTop:10,
        height:50,
        justifyContent:'center'
    },
    birthdayButtonP: {
        backgroundColor:'yellowgreen',
        borderRadius:7,
        width: mainButtonWidth,
        marginTop:10,
        height:50,
        justifyContent:'center'
    },
    signupButtonP: {
        backgroundColor:'grey',
        borderRadius:7,
        width: mainButtonWidth,
        marginTop:50,
        height:50,
        justifyContent:'center'
    },
    signupButtonNP: {
        backgroundColor:'yellowgreen',
        borderRadius:7,
        width: mainButtonWidth,
        marginTop:50,
        height:50,
        justifyContent:'center'
    },
    birthdayText: {
        textAlign: 'center',
        fontSize:25,
    },
})

const validateEmail = (email) => {
    if (email.includes("@") && email.includes(".")) {
        return true
    } else {
        return false
    }
}

const MainScreen = ({navigation}) => {
    return (
    <View style={styles.mainView}>
        <Text style={styles.mainText}>Welcome to PrinceJohn</Text>
        <Pressable style={styles.mainButton} onPress={() => navigation.navigate('login')}>
            <Text style={styles.mainButtonText}>Log In</Text>
        </Pressable>
        <Pressable style={styles.mainButton} onPress={() => navigation.navigate('signup')}>
            <Text style={styles.mainButtonText}>Sign Up</Text>
        </Pressable>
    </View>
    )
}

const LoginScreen2FA = ({code,hook,show2FA}) => {

    const switch2FA = () => {
        if (show2FA) {
            hook("totp","")
            hook("show",false)
        } else {
            hook("show",true)
        }
    }
    return (
        <View style={styles.loginEntryView}>
            <Pressable onPress={() => switch2FA()}>
                <Text style={styles.loginTextTitle}>{show2FA ? "Enter Code:": "Tap to add 2FA Code"}</Text>
            </Pressable>
            {show2FA ?
            <TextInput
                editable
                onChangeText={text => hook("totp",text)}
                keyboardType='numeric'
                value={code}
                autoComplete='off'
                placeholder={"2FA Code"}
                maxLength={8}
                style={styles.loginTextInput}
            /> : null}
        </View>
    )
}

const LoginScreen = ({navigation}) => {
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [totp,setTotp] = useState("")
    const [show2FA, setShow2FA] = useState(false)
    const [canLogin,setCanLogin] = useState(false)

    async function attemptLogin () {
        navigation.navigate("loading")
        result = await sendNewLoginRequest(email,password,totp)
        console.log(result)
        if (result["status"] == 200) {
            navigation.navigate("loginconfirm",{
                "email":email,
                "password":password,
                "loginDeviceID": loginDeviceID,
                "newUser": false
            })
        } else {
            navigation.goBack()
            Alert.alert('Login Attempt Failed','Either Email, password, or 2FA code are incorrect')
        }
    }
    const change = (key,value) => {
        tempEmail = validateEmail(email)
        tempPassword = password
        tempTotp = (totp.length == 8)
        tempShow2FA = show2FA
        if(key == "email") {
            setEmail(value)
            tempEmail = validateEmail(value)
        } else if (key == "password") {
            setPassword(value)
            tempPassword = value
        } else if (key == "show") {
            setShow2FA(value)
            tempShow2FA = value
        } else {
            setTotp(value)
            tempTotp = (value.length == 8)
        }
        if (!tempShow2FA) {
            if (tempEmail&& tempPassword) {
                setCanLogin(true)
            } else {
                setCanLogin(false)
            }
        } else {
            if (tempEmail && tempPassword && tempTotp) {
                setCanLogin(true)
            } else {
                setCanLogin(false)
            }
        }
    }
    
    return (
        <View style={styles.loginTopView}>
            <View style={styles.loginEntryView}>
                <Text style={styles.loginTextTitle}>Email:</Text>
                <TextInput
                    editable
                    onChangeText={text => change("email",text)}
                    value={email}
                    autoComplete="email"
                    placeholder={"Email"}
                    style={styles.loginTextInput}
                />
            </View>
            <View style={styles.loginEntryView}>
                <Text style={styles.loginTextTitle}>Password:</Text>
                <TextInput
                    editable
                    onChangeText={text => change("password",text)}
                    value={password}
                    autoComplete='password'
                    placeholder={"Password"}
                    secureTextEntry={true}
                    style={styles.loginTextInput}
                />
            </View>
            <LoginScreen2FA value={totp} hook={change} show2FA={show2FA}/>
            <Pressable style={canLogin ? styles.loginButtonEnabled : styles.loginButtonDisabled} disabled={canLogin?false:true} onPress={attemptLogin}>
                <Text style={styles.loginButtonText}>Log In</Text>
            </Pressable>
        </View>
    )
}

const LoginConfirmScreen = ({route}) => {
    const { email, password, loginDeviceID, newUser } = route.params

    const login = useContext(LoginContext)

    const backAction = () => {
        return true;
      };

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
          backAction,
        );
        return () => backHandler.remove();
      }, []);

    async function completeLogin() {
        const result = await newLogin(email,password,loginDeviceID)
        if (result["status"] == 200) {
            BackHandler.removeEventListener("hardwareBackPress",backAction)
            login(result)
        } else {
            Alert.alert("Login attempt failed. Make sure you have clicked the email sent to you.")
        }
    }

    return (
        <View style={styles.loginTopView}>
            <Text style={styles.loginConfirmText}>An email has been sent to your email address at {email} to confirm this {newUser ? "signup " : "login "} 
            attempt. Click the button below to log in once you've clicked the link.</Text>
            <Pressable style={styles.loginConfirmButton} onPress={completeLogin}>
                <Text style={styles.loginButtonText}>Log In!</Text>
            </Pressable>
        </View>
    )
}

const SignupScreen = ({navigation}) => {
    const [email,setEmail] = useState("")
    const [password1,setPassword1] = useState("")
    const [password2,setPassword2] = useState("")
    const [username, setUsername] = useState("")
    const [birthday, setBirthday] = useState("")
    const [signup, setSignUp] = useState(false)
    const [passwordMatch, setPasswordMatch] = useState(false)

    const clear = () => {
        setEmail("")
        setPassword1("")
        setPassword2("")
        setUsername("")
        setBirthday("")
        setSignUp(false)
        setPasswordMatch(false)
    }

    const change = (key,value) => {
        tempEmail = validateEmail(email)
        tempPassword1 = password1
        tempPassword2 = password2
        tempUsername = username
        tempBirthday = birthday
        tempPasswordMatches = passwordMatch
        if(key == "email") {
            setEmail(value)
            tempEmail = validateEmail(value)
        } else if (key == "password1") {
            setPassword1(value)
            tempPassword1 = value
        } else if (key == "password2"){
            setPassword2(value)
            tempPassword2 = value
        } else if (key == "username") {
            setUsername(value)
            tempUsername = value
        } else {
            setBirthday(value)
            tempBirthday = value
        }
        if (tempPassword1) {
            if (tempPassword1 == tempPassword2) {
                tempPasswordMatches = true
                setPasswordMatch(true)
            } else {
                tempPasswordMatches = false
                setPasswordMatch(false)
            }
        } else {
            tempPasswordMatches = false
            setPasswordMatch(false)
        }
        if (tempBirthday && tempEmail && tempUsername && tempPasswordMatches) {
            setSignUp(true)
        } else {
            setSignUp(false)
        }
    }

    const changeBirthday = (event, selectedDate) => {
        const newDate = selectedDate
        change("birthday",newDate)
    }

    const pickBirthday = () => {
        datePick = new Date()
        maxDate = new Date(2005,11,30)
        DateTimePickerAndroid.open({
            value:datePick,
            onChange:changeBirthday,
            mode:"date",
            maximumDate:maxDate
        })
    }

    async function signMeUp () {
        result = await sendSignupRequest(username,email,password1,birthday)
        if (result) {
            navigation.navigate("loginconfirm",{
                "email":email,
                "password":password1,
                "loginDeviceID": result,
                "newUser": true
            })
        } else {
            clear()
            Alert.alert("Signup attempt failed")
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.signupTopView}>
            <View style={styles.loginEntryView}>
                <Text style={styles.loginTextTitle}>Enter Username:</Text>
                <TextInput
                    editable
                    onChangeText={text => change("username",text)}
                    value={username}
                    autoComplete="username"
                    placeholder={"Username"}
                    style={styles.loginTextInput}
                />
            </View>
            <View style={styles.loginEntryView}>
                <Text style={styles.loginTextTitle}>Enter Email:</Text>
                <TextInput
                    editable
                    onChangeText={text => change("email",text)}
                    value={email}
                    autoComplete="email"
                    placeholder={"Email"}
                    style={styles.loginTextInput}
                />
            </View>
            <View style={styles.loginEntryView}>
                <Text style={styles.loginTextTitle}>Enter Password:</Text>
                <TextInput
                    editable
                    onChangeText={text => change("password1",text)}
                    value={password1}
                    autoComplete='password'
                    placeholder={"Password"}
                    secureTextEntry={true}
                    style={styles.loginTextInput}
                />
            </View>
            <View style={styles.loginEntryView}>
                <Text style={styles.loginTextTitle}>Re-enter Password:</Text>
                <Text style={styles.loginTextTitle}>{passwordMatch ? "Password matches" : "Passwords don't match"}</Text>
                <TextInput
                    editable
                    onChangeText={text => change("password2",text)}
                    value={password2}
                    autoComplete='password'
                    placeholder={"Password"}
                    secureTextEntry={true}
                    style={styles.loginTextInput}
                />
            </View>
            <Pressable style={birthday ? styles.birthdayButtonP : styles.birthdayButtonNP} onPress={pickBirthday}>
                <Text style={styles.birthdayText}>Enter Birthday</Text>
            </Pressable>
            <Pressable style={signup ? styles.signupButtonNP : styles.signupButtonP} disabled={signup?false:true} onPress={signMeUp}>
                <Text style={styles.birthdayText}>Sign Up</Text>
            </Pressable>
        </ScrollView>
    )
}

const Stack = createNativeStackNavigator();

const NoLogView = ({login}) => {

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="main" component={MainScreen} initialParams={{"login":login}} options={{headerShown:false, headerTitleAlign:"center"}}/>
                <Stack.Screen name="login" component={LoginScreen} options={{headerTitle:"Log In", headerTitleAlign:"center"}}/>
                <Stack.Screen name="signup" component={SignupScreen} options={{headerTitle:"Sign Up", headerTitleAlign:"center"}}/>
                <Stack.Screen name="loading" component={LoadingScreen} options={{headerShown:false, animation:'none'}}/>
                <Stack.Screen name="loginconfirm" component={LoginConfirmScreen} options={{headerShown:false}}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default NoLogView