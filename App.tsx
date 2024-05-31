import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { AppRegistry, StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import LoginScreen from "./src/infrastructure/UI/screens/2_LogIn.screen";
import HomeScreen from "./src/infrastructure/UI/screens/4_Home.screen";

import ScreenRegisterA from "./src/infrastructure/UI/screens/3_Register/3_RegisterStepA.screen";
import ScreenRegisterB from "./src/infrastructure/UI/screens/3_Register/3_RegisterStepB.screen";
import ScreenRegisterC from "./src/infrastructure/UI/screens/3_Register/3_RegisterStepC.screen";
import ScreenRegisterD from "./src/infrastructure/UI/screens/3_Register/3_RegisterStepD.screen";

import ProfileScreen from "./src/infrastructure/UI/screens/5_UserProfile.screen";
import EditUserScreen from "./src/infrastructure/UI/screens/7_UserEdit.screen";
import SplashScreen from "./src/infrastructure/UI/screens/1_SplashScreen.screen";
import GoogleLogin from "./src/infrastructure/UI/screens/2_LogIn.screen";
import OldStats from "./src/infrastructure/UI/screens/17_OldStatistics.screen";
import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import UserScreen from "./src/infrastructure/UI/screens/29_UserOtherProfile.screen";
import './languages/i18n';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useNavigation } from "@react-navigation/native";
import HelpScreen from "./src/infrastructure/UI/screens/30_ManagerHelp.screen";
import ShopOffers from "./src/infrastructure/UI/screens/27_ShopOffers.screen";
import ShopScreen from "./src/infrastructure/UI/screens/31_ManagerShop.screen";

const Stack = createStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Splash" options={{ headerShown: false }} component={SplashScreen}/>    
        <Stack.Screen name="LoginScreen" options={{ headerShown: false }} component={LoginScreen}/>
        <Stack.Screen name="GoogleLogin" options={{ headerShown: false }} component={GoogleLogin}/>

        <Stack.Screen name="ScreenRegisterA" options={{ headerShown: false }} component={ScreenRegisterA}/>
        <Stack.Screen name="ScreenRegisterB" options={{ headerShown: false }} component={ScreenRegisterB}/>
        <Stack.Screen name="ScreenRegisterC" options={{ headerShown: false }} component={ScreenRegisterC}/>
        <Stack.Screen name="ScreenRegisterD" options={{ headerShown: false }} component={ScreenRegisterD}/>

        <Stack.Screen name="ManagerShop" options={{ headerShown: false }} component={ShopScreen}/>
        <Stack.Screen name="ScreenOffers" options={{ headerShown: false }} component={ShopOffers}/>

        <Stack.Screen name="HomeScreen" options={{ title: "EaseAer", headerShown: false }} component={HomeScreen}/>
        
        <Stack.Screen name="Profile" component={ProfileScreen}
          options={{
            headerTitle: () => ( <Image source={require('./assets/easeaer_icons/EaseAer_Logo_3_Png.png')} style={{ width: 132, marginBottom: 10 }} resizeMode="contain"/>
            ),
            headerStyle: { backgroundColor: 'white', borderBottomWidth: 0, shadowOpacity: 0 },
            headerTitleStyle: { color: '#321e29', fontSize: 30 },
            headerLeft: () => {
              const navigation = useNavigation();
              return (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <View style={{ width: 36, height: 36, backgroundColor: '#875a31', borderRadius: 10, marginBottom: 10, marginLeft: 10, justifyContent: 'center', alignItems: 'center' }}>
                    <MaterialCommunityIcons name="arrow-left" size={20} color='white' />
                  </View>
                </TouchableOpacity>
              );
            },
          }}
        />

        <Stack.Screen name="Help" component={HelpScreen}
          options={{
            headerTitle: () => ( <Image source={require('./assets/easeaer_icons/EaseAer_Logo_3_Png.png')} style={{ width: 132, marginBottom: 10 }} resizeMode="contain"/>
            ),
            headerStyle: { backgroundColor: 'white', borderBottomWidth: 0, shadowOpacity: 0 },
            headerTitleStyle: { color: '#321e29', fontSize: 30 },
            headerLeft: () => {
              const navigation = useNavigation();
              return (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <View style={{ width: 36, height: 36, backgroundColor: '#875a31', borderRadius: 10, marginBottom: 10, marginLeft: 10, justifyContent: 'center', alignItems: 'center' }}>
                    <MaterialCommunityIcons name="arrow-left" size={20} color='white' />
                  </View>
                </TouchableOpacity>
              );
            },
          }}
        />

        <Stack.Screen name="Edit" component={EditUserScreen} />
        <Stack.Screen name="UserScreen" component={UserScreen}/>
        <Stack.Screen name="OldStats" component={OldStats}/>          
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
