import StocksTabView from './StocksTabView';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer} from '@react-navigation/native';
import {Text,View, Dimensions, Pressable} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useContext } from 'react';
import { StockContext, LogoutContext } from './storage';
import { LineChart } from 'react-native-chart-kit';
import { StyleSheet } from 'react-native';

const TabBottom = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const screenWidth = Dimensions.get("window").width
const screenHeight = Dimensions.get("window").height


const styles = StyleSheet.create({
  stockPage:{
    justifyContent:'center'
  },
  stockTopBar:{
    width:screenWidth,
    flexDirection:"row",
    padding:20,
    paddingTop:40,
    justifyContent:'space-between'
  },
  stockTicker:{
    fontSize:30,
    flexGrow:1,
  },
  stockPrice :{
    fontSize:30,
    flexGrow:1,
    textAlign:'right'
  },
  stockDescription:{
    fontSize:30,
    alignSelf:'center',
    marginLeft:20,
    marginRight:20
  },
  stockBack:{
    backgroundColor:'lightblue',
    borderRadius:7,
    marginTop:100,
    width: screenWidth * 0.8,
    height: screenHeight * 0.08,
    alignSelf:'center',
    justifyContent: 'center'
  },
  stockBackText:{
    fontSize:25,
    alignSelf:'center'
  }
})

const UserProfile = () => {
  logout = useContext(LogoutContext)
  return (
    <View>
      <Text style={styles.stockBackText}>User Profile</Text>
      <Pressable style={styles.stockBack} onPress={logout}>
        <Text style={styles.stockBackText}>Log Out</Text>
      </Pressable>
    </View>
  ) 
  }
  
  const UserPortfolio = () => {
    return <Text style={styles.stockBackText}>User Portfolio</Text>
  }

  const LoggedTabs = () => (
      <TabBottom.Navigator>
        <TabBottom.Screen name="Stock Market" component={StocksTabView}/>
        <TabBottom.Screen name="Portfolio" component={UserPortfolio}/>
        <TabBottom.Screen name="Profile" component={UserProfile}/>
      </TabBottom.Navigator>
  )

  const StockPage = ({navigation, route}) => {
    ticker = route.params.ticker
    const stockData = useContext(StockContext)
    const stock = stockData[ticker]
    return (
    <View style={styles.stockPage}>
      <View style={styles.stockTopBar}>
        <Text style={styles.stockTicker}>{stock.ticker}</Text>
        <Text style={styles.stockPrice}>${stock.price}</Text>
      </View>
      <Text style={styles.stockDescription}>{stock.fullName}</Text>
      <LineChart
        data={{
          labels: ["OCT", "DEC", "FEB", "APR", "JUN", "AUG"],
          datasets: [{data: stock.priceHistory}]
        }}
        width={screenWidth * 0.95} // from react-native
        height={220}
        yAxisLabel="$"
        withDots={false}
        withShadow={false}
        withInnerLines={false}
        withOuterLines={false}
        chartConfig={{
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          backgroundColor: "lightblue",
        }}
        style={{
          marginTop: 20,
          marginBottom:40,
          borderRadius: 16,
          alignSelf:'center'
        }}
      />
      <Text style={styles.stockDescription}>{stock.description}</Text>
      <Pressable style={styles.stockBack} onPress={() => navigation.goBack()}>
        <Text style={styles.stockBackText}>Go Back</Text>
      </Pressable>
    </View>
    )
  }

  const LoggedView = () => {
    return (
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="home" component={LoggedTabs} />
            <Stack.Screen name="stock" component={StockPage} />
          </Stack.Navigator>
        </NavigationContainer>
    )
  }

  export default LoggedView