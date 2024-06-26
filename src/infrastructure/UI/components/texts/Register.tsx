import React, { FunctionComponent } from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';

import * as Font from 'expo-font';

const styles = StyleSheet.create({
    text: {
        //fontFamily: 'SF UI Display',
        fontWeight: 'bold',
        fontSize: 35,
        color: '#66fcf1',
        marginTop: 8,
        marginBottom: 40,
    },
});


const Register: FunctionComponent<TextProps> = (props) => {
    return <Text style = {[styles.text, props.style]}>{props.children}</Text>
}

export default Register;