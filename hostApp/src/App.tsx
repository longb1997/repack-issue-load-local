import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {initMiniAppScriptManager} from './InitScriptManager';
import {MiniAppScreen} from './MiniAppDefine';
import HomeScreen from './HomeScreen';

initMiniAppScriptManager();

const MainStack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <MainStack.Navigator initialRouteName="home">
        <MainStack.Screen name="home" component={HomeScreen} />
        <MainStack.Screen name="miniScreen" component={MiniAppScreen} />
      </MainStack.Navigator>
    </NavigationContainer>
  );
};

export default App;
