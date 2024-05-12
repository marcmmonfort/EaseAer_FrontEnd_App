import React, { FunctionComponent } from 'react';
import { StyleSheet, Text, TextProps} from 'react-native';

import * as Font from 'expo-font';

const styles = StyleSheet.create({
    title: {
        //fontFamily: 'Rafaella',
        fontWeight: 'bold',
        fontSize: 68,
        color: '#fff',
        marginBottom: 0,
    },
});


const Title: FunctionComponent<TextProps> = (props) => {
    return <Text style = {[styles.title, props.style]}>{props.children}</Text>
}

export default Title;