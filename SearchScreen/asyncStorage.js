import { AsyncStorage } from 'react-native';

export async function setItem(key,value){
    try {
        await AsyncStorage.setItem(key,value)
    } catch (error) {
        console.log(error.message);
    }
}

export async function getItem(key){
    let value = []
    try {
        value = await AsyncStorage.getItem(key) || [];
    } catch (error) {
        console.log(error.message);
    }
    console.log('value is ', value)
    return value
}
