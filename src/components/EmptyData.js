import React from 'react';
import {View, Text, ImageBackground} from 'react-native';

export default function EmptyData(props) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 20}}>
        Data Empty
      </Text>
      <ImageBackground
        style={{
          width: 150,
          height: 150,
        }}
        source={require('../assets/icons/empydata.png')}
      />
    </View>
  );
}
