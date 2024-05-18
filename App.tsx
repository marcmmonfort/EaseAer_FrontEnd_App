import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { AppRegistry, StyleSheet, Text, View } from "react-native";
import LoginScreen from "./src/infrastructure/UI/screens/2_LogIn.screen";
import HomeScreen from "./src/infrastructure/UI/screens/4_Home.screen";

import ScreenRegisterInicial from "./src/infrastructure/UI/screens/3_Register/3_RegisterStepA.screen";
import ScreenRegisterC from "./src/infrastructure/UI/screens/3_Register/3_RegisterStepC.screen";
import ScreenRegisterD from "./src/infrastructure/UI/screens/3_Register/3_RegisterStepD.screen";
import ScreenRegisterFinal from "./src/infrastructure/UI/screens/3_Register/3_RegisterStepF.screen";

import ProfileScreen from "./src/infrastructure/UI/screens/5_UserProfile.screen";
import EditUserScreen from "./src/infrastructure/UI/screens/7_UserEdit.screen";
import SplashScreen from "./src/infrastructure/UI/screens/1_SplashScreen.screen";
import GoogleLogin from "./src/infrastructure/UI/screens/2_LogIn.screen";
import UserStats from "./src/infrastructure/UI/screens/17_EntertainmentStatistics.screen";
import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import UserScreen from "./src/infrastructure/UI/screens/29_UserOtherProfile.screen";
import './languages/i18n';

const Stack = createStackNavigator();

export default function App() {
  /*useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);*/
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Splash" options={{ headerShown: false }} component={SplashScreen}/>    
        <Stack.Screen name="LoginScreen" options={{ headerShown: false }} component={LoginScreen}/>
        <Stack.Screen name="GoogleLogin" options={{ headerShown: false }} component={GoogleLogin}/>
        <Stack.Screen name="ScreenRegisterInicial" options={{ headerShown: false }} component={ScreenRegisterInicial}/>
        <Stack.Screen name="ScreenRegisterC" options={{ headerShown: false }} component={ScreenRegisterC}/>
        <Stack.Screen name="ScreenRegisterD" options={{ headerShown: false }} component={ScreenRegisterD}/>
        <Stack.Screen name="ScreenRegisterFinal" options={{ headerShown: false }} component={ScreenRegisterFinal}/>
        <Stack.Screen name="HomeScreen" options={{ title: "LPlan", headerShown: false }} component={HomeScreen}/>
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Edit" component={EditUserScreen} />
        <Stack.Screen name="UserScreen" component={UserScreen}/>
        <Stack.Screen name="UserStats" component={UserStats}/>          
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
