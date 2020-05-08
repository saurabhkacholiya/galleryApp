import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Image,
    FlatList,
    Dimensions,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import axios from "axios";
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    FontAwesome,
    Entypo,
} from 'react-native-vector-icons';
import {
    getItem,
    setItem,
} from "./asyncStorage";
import NetInfo from '@react-native-community/netinfo';
import { arr } from "./constant";

const ITEM_WIDTH = Dimensions.get('window').width;
const API_KEY = 'ddfc2122dc4634f03eec5673ea678f8a';

const deepCopy = (data) => {
    return JSON.parse(JSON.stringify(data))
}

export default function SearchScreen() {
    const [response, setResponse] = useState([])
    const [numberOfColumn, setNumberOfColumn] = useState(3)
    const [searchTerm, setSearchTerm] = useState('Random')
    const [pageNo, setPageNo] = useState(1)
    const [refreshing, setRefreshing] = useState(false)
    const [networkStatus, setNetworkStatus] = useState(true)

    useEffect(() => {
        NetInfo.fetch().then(state => {
            setNetworkStatus(state.isConnected)
        })
    }, [searchTerm])
    
    useEffect(() => {
        if (networkStatus) {
            const urlEndpoint = `https://api.flickr.com/services/rest/?
        method=flickr.photos.search&api_key=${API_KEY}&format=json&text=${searchTerm}
        &nojsoncallback=true&per_page=20&extras=url_s&page=${pageNo}`;

            axios.get(urlEndpoint)
                .then(item => {
                    const newResponse = deepCopy(item.data.photos.photo)
                    const existingResponse = deepCopy(response)
                    setResponse([...newResponse, ...newResponse])
                    setItem("searchTerm", JSON.stringify([...newResponse,...existingResponse]))
                })
                .catch((error) => { console.log("error => ", error) })
        } else {
            getItem("searchTerm")
                .then(item => setResponse(deepCopy(item)))
                .catch(error => console.log('error ', error))
                .finally(() => setTimeout(() => {
                    setNumberOfColumn(2)
                }, 500))
        }

        setRefreshing(false)
    }, [searchTerm, pageNo, networkStatus])



    const debounce = function (callback, delay) {
        let timer;
        return function (data) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                callback(data);
            }, delay);
        }
    }

    const setDataAfterTimeOut = (data) => {
        setPageNo(1)
        setResponse([])
        setSearchTerm(data)
    }

    const onChange = debounce(setDataAfterTimeOut, 300);

    const changeColumn = () => {
        if (numberOfColumn === 4) {
            setNumberOfColumn(2)
        } else {
            setNumberOfColumn(numberOfColumn + 1)
        }
    }

    const refreshPage = () => {
        setRefreshing(true)
        setSearchTerm('happy_days')
        setPageNo(1)
    }
    return (
        <SafeAreaView style={styles.safeAreaViewStyle}>
            <View style={styles.headerView}>
                <View style={styles.searchView}>
                    <View style={styles.searchViewWithElement}>
                        <FontAwesome
                            style={styles.iconStyle}
                            name="search"
                            color={"#F7882F"}
                            size={16}
                        />
                        <TextInput
                            style={styles.textInputStyle}
                            placeholder="Search Images"
                            onChangeText={onChange}
                        />
                    </View>
                </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#fff' }}>
                <FlatList
                    data={response}
                    renderItem={({ item }) => (
                        <View key={`${item.id}_${item.secret}`} style={{ margin: 5 }}>
                            <Image style={{
                                flex: 1,
                                height: 100,
                                width: (ITEM_WIDTH - 10 * numberOfColumn) / numberOfColumn
                            }}
                                source={{ uri: item.url_s }}
                                resizeMode="contain"
                            />
                        </View>
                    )}
                    keyExtractor={(item) => `${item.id}_${item.title}_${item.secret}`}
                    numColumns={numberOfColumn}
                    onEndReached={() => {
                        if(networkStatus){
                            setPageNo(pageNo + 1)
                        }
                    }}
                    onEndReachedThreshold={0.3}
                    key={numberOfColumn}
                    onRefresh={refreshPage}
                    refreshing={refreshing}
                    extraData={[response,searchTerm,pageNo]}
                />
            </View>

            <TouchableOpacity
                onPress={changeColumn}
                style={styles.resizeView}
            >
                <Entypo
                    name="resize-full-screen"
                    color={"#FFF"}
                    size={20}
                />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeAreaViewStyle: {
        flex: 1,
        backgroundColor: '#F7882F'
    },
    headerView: {
        height: 90,
        backgroundColor: '#F7882F',
        flex: 0,
        justifyContent: 'flex-end',
    },
    searchView: {
        backgroundColor: '#fff',
        height: 50,
        marginTop: 0,
        margin: 10,
        borderRadius: 5,
    },
    searchViewWithElement: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconStyle: {
        margin: 10,
    },
    textInputStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
    },
    resizeView: {
        height: 50,
        width: 50,
        borderRadius: 90,
        backgroundColor: '#F7882F',
        position: 'absolute',
        bottom: 40,
        right: 40,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
});
