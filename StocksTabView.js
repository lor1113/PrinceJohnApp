import React, { useState, useContext, createContext} from 'react';
import { SearchBar } from '@rneui/themed';
import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StyleSheet,
  Dimensions,
  Pressable
} from 'react-native';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { StockContext } from './storage';

const SearchContext = createContext("")
const LinkContext = createContext("")

const TabTop = createMaterialTopTabNavigator();

const stockHeight = Dimensions.get('window').height / 6.5
const stockWidth = Dimensions.get('window').width * 0.9
const styles = StyleSheet.create({
  stock: {
    borderColor: "black",
    borderWidth: 3,
    color: "black",
    padding: 10,
    margin: 8,
    borderRadius: 15,
    height:stockHeight,
    width: stockWidth,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    alignContent:'stretch'
  },
  "title": {
    flexBasis: '25%',
    fontSize:20,
    fontWeight: 'bold',
  },
  "fullName":{
    fontSize:16,
    flexBasis: '75%',
    textAlign:"right",
  },
  "price": {
    flexBasis: '50%',
    fontSize:22
  },
  "deltaPos":{
    flexBasis: '50%',
    textAlign:"right",
    color:'green',
    fontSize:22
  },
  "deltaNeg": {
    flexBasis: '50%',
    textAlign:"right",
    color:"red",
    fontSize:22
  }
});

  const StockDelta = ({delta}) => {
    delta = delta.toFixed(3)
    if (delta > 0) {
      return (<Text style={styles.deltaPos}>▲{delta}%</Text>)
    } else {
      return (<Text style={styles.deltaNeg}>▼{delta}%</Text>)
    }
  }
  
  const Stock = ({stock}) => {
    stockLink = useContext(LinkContext)
    return (
      <Pressable onPress={() => {stockLink(stock.ticker)}}>
        <View style={styles.stock}>
          <Text style={styles.title}>{stock.ticker}</Text>
          <Text style={styles.fullName}>{stock.fullName}</Text>
          <Text style={styles.price}>${stock.price}</Text>
          <StockDelta delta={stock.delta}/>
        </View>
      </Pressable>
    )
  }
  
  const StocksView = ({stockList}) => {
    return (
      <SafeAreaView>
        <FlatList
          contentContainerStyle = {{
            justifyContent: 'center',
            alignItems: 'center'
          }}
          data={stockList}
          renderItem={({item}) => <Stock stock={item}/>}
          keyExtractor={item => item.ticker}
        />
      </SafeAreaView>
    );
  }
  
  const StocksViewSorted = ({navigation,route}) => {
    const search = useContext(SearchContext)
    const stockData = useContext(StockContext)
    stockList = Object.values(stockData)
    sortDir = route.params.sortDir
    let filteredStocks = []
    if (search != "") {
        filteredStocks = stockList.filter((x) => x.ticker.includes(search) || x.fullName.includes(search))
    } else {
        filteredStocks = stockList
    }
    if (sortDir == 0) {
        filteredStocks.sort((a, b) => a.ticker > b.ticker ? 1 : -1);
    } else if (sortDir == 1) {
        filteredStocks.sort((a, b) => a.delta > b.delta ? -1 : 1);
    } else {
        filteredStocks.sort((a, b) => a.delta > b.delta ? 1 : -1);
    }

    const stockLink = (ticker) => {
      navigation.navigate("stock",{"ticker":ticker})
    }

    return (
      <LinkContext.Provider value={stockLink}>
        <StocksView stockList={filteredStocks}></StocksView>
      </LinkContext.Provider>
    )
  }
  
  const StocksTabView = () => {
    const [search, setSearch] = useState("")
    const updateSearch = (search) => {
        setSearch(search)
    };
    return (
        <SearchContext.Provider value={search}>
            <TabTop.Navigator>
                <TabTop.Screen name="All Stocks" component={StocksViewSorted} initialParams={{"sortDir":0}} />
                <TabTop.Screen name="Biggest Gains" component={StocksViewSorted} initialParams={{"sortDir":1}} />
                <TabTop.Screen name="Biggest Losses" component={StocksViewSorted} initialParams={{"sortDir":-1}} />
            </TabTop.Navigator>
            <SearchBar
                placeholder="Search"
                onChangeText={updateSearch}
                value={search}
                lightTheme="true"
            />
        </SearchContext.Provider>
    );
  }

  export default StocksTabView