import React , { useEffect , useState} from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  Image,
  ScrollView,
  SafeAreaView,
 } from 'react-native';
import axios from "axios";
const API_KEY = 'ddfc2122dc4634f03eec5673ea678f8a'

export default function App() {
  const [response,setResponse] = useState(null)
  
  useEffect(() => {
    const urlEndpoint = `https://api.flickr.com/services/rest/?
    method=flickr.photos.search&api_key=${API_KEY}&format=json&text=Random
    &nojsoncallback=true&per_page=20&extras=url_s&page=5`;

    axios.get(urlEndpoint)
    .then(response => setResponse(response.data.photos.photo))
    .catch((error) => { console.log(error)})

  },[])
  return (
    <SafeAreaView style={styles.container}>
        <ScrollView style={{flex:1}}>
          {
            response &&
              response.map((item) => {
                console.log('item ', item)
                  return (
                    <View key={item.id}>
                        <Image style={{height:100,width:100}} source={{uri: item.url_s}} />
                    </View>
                  )
              })
          }
        </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
