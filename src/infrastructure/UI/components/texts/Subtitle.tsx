import React, { FunctionComponent } from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';

import * as Font from 'expo-font';

const styles = StyleSheet.create({
    subtitle: {
        //fontFamily: 'SF UI Display',
        fontWeight: 'bold',
        fontSize: 18,
        color: 'white',
        marginTop: 40,
    },
});

const SubTitle: FunctionComponent<TextProps> = (props) => {
    return <Text style = {[styles.subtitle, props.style]}>{props.children}</Text>
}

export default SubTitle;