import {Text, View, StyleSheet} from 'react-native';

export const BlankScreen = () => {
    return <></>
}

export const LoadingScreen = () => {

    return(<Text style={{
        textAlignVertical: "center",
        textAlign: 'center',
        flex:1,
        fontSize:40
    }}>Loading</Text>)
}

const styles = StyleSheet.create({
    text:{
        textAlign: 'center',
        fontSize:40
    },
    view: {
        justifyContent: 'center',
        flex:1
    }
})

export const ServerDown = () => {
    return(
            <View style={styles.view}>
                <Text style={styles.text}>The Server is Down</Text>
                <Text style={styles.text}>touch grass or something</Text>
            </View>
    )
}
