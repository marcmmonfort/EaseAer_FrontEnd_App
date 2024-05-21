import { SessionService } from "../../services/user/session.service";
import { UserEntity } from "../../../domain/user/user.entity";
import { useFocusEffect } from "@react-navigation/native";
import { CRUDService } from "../../services/user/CRUD.service";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity,Button, ImageBackground, Platform, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as Speech from 'expo-speech';
import Filter from 'bad-words';

// BEREAL
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";

async function loadFonts() {
  await Font.loadAsync({
    'Corporate': require('../../../../assets/easeaer_fonts/Corporate_Font.ttf'),
    'Emirates': require('../../../../assets/easeaer_fonts/Emirates_Font.ttf'),
    'SFNS': require('../../../../assets/easeaer_fonts/SF_Font.ttf'),
  });
}

export default function ProfileScreen() {
  const [currentUser, setCurrentUser] = useState<UserEntity | null>(null);
  const [photoUser, setPhotoUser] = useState("");
  const [auxPhotoUser, setAux] = useState("");
  const [loading, setLoading] = useState(false);
  const [cam, setCam] = useState(false);
  const [icon, setIcon] = useState(<MaterialCommunityIcons name="store" size={24} color="black"/>);
  let CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dlsyquban/upload";
  const navigation = useNavigation();

  // BEREAL
  const [numPagePublication, setNumPagePublication] = useState<number>(1);
  const [numOwnPublications, setNumOwnPublications] = useState<number>(0);
  const [recargar, setRecargar] = useState<string>('');
  const [currentPublicationIndex, setCurrentPublicationIndex] = useState(1);
  const {t} = useTranslation();
  const [qrVisible, setqrVisible] = useState<boolean>(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts().then(() => {
      setFontsLoaded(true);
    });
  }, []);

  const titleFont = Platform.select({
    ios: 'Emirates',
    android: 'Emirates',
  });
  const subtitleFont = Platform.select({
    ios: 'Corporate',
    android: 'Corporate',
  });
  const bodyFont = Platform.select({
    ios: 'SFNS',
    android: 'SFNS',
  });

  const logOutButtonFunction = async () => {
    try {
      const nothing = "";
      AsyncStorage.setItem('token', nothing);
      navigation.navigate('LoginScreen' as never);
    } catch (error) {
      console.error("Error Deleting The Token: ", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const getUser = async () => {
        const userId = await SessionService.getCurrentUser();
        if (userId) {
          try {
            await CRUDService.getUserById(userId).then(async (response) => {
              if (response?.data && response.data.descriptionUser) {
          
                const customFilter = new Filter({regex: /\*|\.|$/gi});
                customFilter.addWords('idiota', 'retrasado');
      
                const filteredDescription = customFilter.clean(response.data.descriptionUser);
                console.log(filteredDescription);
              
                response.data.descriptionUser = filteredDescription;
                setCurrentUser(response.data);
                if (response.data.roleUser === 'business') {
                  setIcon(
                    <MaterialCommunityIcons
                      style={styles.iconVerified}
                      name="store"
                      size={18}
                      color="#3897f0"
                    />
                  );
                } else if (response.data.roleUser === 'admin') {
                  setIcon(
                    <MaterialCommunityIcons
                      style={styles.iconVerified}
                      name="cog"
                      size={18}
                      color="#3897f0"
                    />
                  );
                } else if (response.data.roleUser === 'verified') {
                  setIcon(
                    <MaterialCommunityIcons
                      style={styles.iconVerified}
                      name="check-circle"
                      size={18}
                      color="#3897f0"
                    />
                  );
                } else {
                  setIcon(
                    <MaterialCommunityIcons
                      style={styles.iconVerified}
                      name="account"
                      size={18}
                      color="#3897f0"
                    />
                  );
                }
              }
              try{
                await SessionService.getAudioDescription()
                .then((isAudioDescription) => {
                  if(isAudioDescription==='si'){
                    speakCurrentUser(response?.data);
                  }
                });
              
              }catch{
                console.log("NO SE OBTIENE BIEN EL GET AUDIO DESCRIPTION.");
              }
              
            });
          } catch (error) {
            console.error("Error retrieving user:", error);
          }
        }
      };
      getUser();
    }, [])
  );

  /*
  useFocusEffect(
    React.useCallback(() => {
      let isMounted = true;
      const fetchData = async () => {
        try {
          const userId = await SessionService.getCurrentUser();
          if (userId && isMounted) {
            const response = await PublicationService.obtainOwnPosts(userId);
            const publications = response.data;

            if (isMounted) {
              setListOwnPublications(publications);
              setNumOwnPublications(publications.length);
            }
          }
        } catch (error) {
          console.error("Error obtaining our own publications: ", error);
        }
      };
      fetchData();
      return () => {
        isMounted = false;
      };
    }, [numPagePublication, recargar])
  );  
  */
  
  const speakCurrentUser = async (currentUser:UserEntity) => {
    try {
      if (currentUser) {
        Speech.speak(`You're in the profile of ${currentUser.appUser}`, { language: 'en' });
        await new Promise((resolve) => setTimeout(resolve, 500));
        Speech.speak(`His name is ${currentUser.nameUser}`, { language: 'en' });
          await new Promise((resolve) => setTimeout(resolve, 500));
          Speech.speak(`His description is ${currentUser.descriptionUser}`, { language: 'en' });
      }
    } catch (error) {
      console.error('Error al leer en voz alta:', error);
    }
  };
  
  const setQrVisible = () => {
    setqrVisible(!qrVisible);
  };
  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -50,
  },
  titleContainer: {
    marginBottom: 20,
  },
  profileContour: {
    alignItems: "center",
    justifyContent: "center",
  },
  profileContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginTop: 20,
  },
  profile: {
    alignItems: "center",
    justifyContent: "center",
  },
  profileUserName: {
    fontSize: 26,
    textAlign: 'center',
    fontFamily: titleFont,
    color: "#d0871e",
    marginRight: 4,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 75,
    marginRight: 4,
  },
  profileUserButtons: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    marginTop: 6,
    marginBottom: 18,
  },
  buttonForChanges: {
    marginRight: 4,
    marginLeft: 4,
    padding: 6,
    backgroundColor: "#875a31",
    borderRadius: 12,
    width: 92,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainDescription: {
    alignItems: 'center',
    marginLeft: 4,
    marginTop: 3,
  },
  editSettingsButtons: {
    flexDirection: "row",
  },
  insideButtonForChanges: {
    flexDirection: "row",
  },
  buttonLogOut: {
    justifyContent: 'center',
    alignSelf: "center",
    marginTop: 14,
    marginBottom: 8,
  },
  buttonText: {
    textAlign: 'center',
    fontFamily: bodyFont,
    fontSize: 16,
    color: '#000',
    marginTop: 0,
    marginBottom: 0,
  },
  profileStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  profileTitle: {
    fontSize: 12,
    marginBottom: -10,
  },
  profileStatCountLeft: {
    marginRight: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  profileStatCountRight: {
    alignItems: "center",
    justifyContent: "center",
  },
  textFoll: {
    fontSize: 14,
    fontFamily: bodyFont,
    color: "yellow",
  },
  numFoll: {
    fontFamily: bodyFont,
    fontSize: 26,
    color: '#66fcf1',
  },
  titleNameDescription: {
    fontFamily: bodyFont,
    fontSize: 18,
    color: '#b3b0a1',
  },
  textNameDescription: {
    fontFamily: subtitleFont,
    fontSize: 20,
    color: '#321e29',
    marginTop: 2,
    marginBottom: 8,
  },
  profileBio: {
    alignItems: 'center',
    justifyContent: "center",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  usernameAndVerified: {
    flexDirection: "row",
    alignItems: 'center',
    marginBottom: 5,
  },
  iconVerified: {
    marginTop: 2,
  },
  post_images: {
    width: 120,
    height: 120,
    borderRadius: 16,
    resizeMode: 'cover',
  },
  posts: {
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 4,
  },
  post_complete: {
    alignItems: 'center',
    marginRight: 4,
    marginLeft: 4,
  },
  post_description: {
    alignItems: 'center',
    width: 120,
    backgroundColor: 'black',
    marginTop: 4,
    borderRadius: 16,
  },
  time_post: {
    fontSize: 12,
    fontFamily: bodyFont,
    color: "yellow",
    marginTop: 2,
    marginBottom: 6,
  },
  scrow_style: {
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    flex: 1,
    paddingLeft: 0,
    paddingRight: 0,
  },
  userButtonEdit: {
    fontFamily: subtitleFont,
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white',
  }
});

  const attribute1 = "user";
  const attribute2 = currentUser ? currentUser.uuid : 'valor predeterminado';

  const formatDate = (dateString: string | undefined) => {
    if (dateString != undefined){
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear()).slice(0);
      return `${day}.${month}.${year}`;
    } else {
      return `Not Available`;
    }
  };

  const formatRole = (roleString: string | undefined) => {
    if (roleString == "pax"){
      return `Passenger`;
    } else if (roleString == "company") {
      return `Company`;
    } else if (roleString == "admin") {
      return `Admin Team`;
    } else if (roleString == "tech") {
      return `Tech Team`;
    } else {
      return `Not Available`;
    }
  };

  const formatGender = (roleString: string | undefined) => {
    if (roleString == "male"){
      return `Male`;
    } else if (roleString == "female") {
      return `Female`;
    } else if (roleString == "other") {
      return `Other`;
    } else {
      return `Not Available`;
    }
  };

  return (
    <ImageBackground style={[styles.backgroundImage, { backgroundColor: '#e9e8e6' }]}>
      <ScrollView>
        <View style={styles.profileContour}>
          {currentUser && (
            <View style={styles.profileContainer}>
              <View style={styles.profile}>
                <View style={styles.profileUserButtons}>
                  <Image source={{ uri: currentUser.photoUser }} style={styles.image} />
                  <View style={styles.mainDescription}>
                    <View style={styles.usernameAndVerified}>
                      <Text style={styles.profileUserName}>@{currentUser.appUser}</Text>
                      <MaterialCommunityIcons style={styles.iconVerified} color="#b3b0a1" name="check-circle" size={18} />
                    </View>
                    <View style={styles.editSettingsButtons}>
                      <TouchableOpacity onPress={() => { navigation.navigate("Edit" as never); }} style={styles.buttonForChanges}>
                        <Text style={styles.userButtonEdit}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => { navigation.navigate("Settings" as never); }} style={styles.buttonForChanges}>
                        <Text style={styles.userButtonEdit}>Settings</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View style={styles.profileBio}>
                  <Text style={styles.titleNameDescription}>Surname(s), Name</Text>
                  <Text style={styles.textNameDescription}>{currentUser.surnameUser}, {currentUser.nameUser}</Text>
                  <Text style={styles.titleNameDescription}>E-Mail</Text>
                  <Text style={styles.textNameDescription}>{currentUser.mailUser}</Text>
                  <Text style={styles.titleNameDescription}>Birthdate</Text>
                  <Text style={styles.textNameDescription}>{formatDate(currentUser.birthdateUser.toString())}</Text>
                  <Text style={styles.titleNameDescription}>Gender, Account Type</Text>
                  <Text style={styles.textNameDescription}>{formatGender(currentUser.genderUser)}, {formatRole(currentUser.roleUser)}</Text>
                  <Text style={styles.titleNameDescription}>Description</Text>
                  <Text style={styles.textNameDescription}>{currentUser.descriptionUser}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.buttonLogOut} onPress={logOutButtonFunction}>
                <MaterialCommunityIcons color="#875A31" name="logout" size={24} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );  
}

