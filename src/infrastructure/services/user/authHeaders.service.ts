import AsyncStorage from "@react-native-async-storage/async-storage";

export class AuthHeaderService{
    static async authHeader(){
        try{
            const tokenData = await AsyncStorage.getItem('token');
            if (tokenData) {
                const token = JSON.parse(tokenData);
                // console.log("TOKEN (Parsed Value):", JSON.parse(tokenData));
                return { Authorization: 'Bearer ' + token };
            } else {
                (console.log("Token Not Found"));
            }
        } catch (error: any) {
            console.error("Error Obteniendo El Usuario", error);
        }
    }
}
