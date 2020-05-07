import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SearchScreen from "./SearchScreen/index";

const MainStack = createStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
          <MainStack.Navigator 
            headerMode="screen"
          >
           <MainStack.Screen 
              name='Gallery'
              component={SearchScreen}
              options={{headerShown: false}}
            />
            </MainStack.Navigator>
        </NavigationContainer>
  )
}