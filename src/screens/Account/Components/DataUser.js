import React from 'react';
import {View, Text} from 'react-native';
import Icons from 'react-native-vector-icons/FontAwesome5';
export default function DataUser(props) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginVertical: 5,
      }}>
      <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
        <View
          style={{
            marginRight: 15,
            width: 30,
          }}>
          <Icons
            name={props.icon}
            size={25}
            color="#40BFFF"
            style={{alignSelf: 'center'}}
          />
        </View>
        <View>
          <Text
            style={{
              fontFamily: 'Poppins',
              fontSize: 15,
              color: '#223263',
              fontWeight: 'bold',
              marginVertical: 10,
            }}>
            {props.field}
          </Text>
        </View>
      </View>
      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
        <Text style={{color: '#777', fontSize: 14}}>{props.value}</Text>
      </View>
    </View>
  );
}
