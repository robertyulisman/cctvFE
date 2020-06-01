import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/native';
export default function Header(props) {
  const navigation = useNavigation();
  return (
    <View style={style.container}>
      {props.btnBackNew && (
        <TouchableOpacity onPress={props.onPress}>
          <Icon name="chevron-left" size={20} style={style.backIcon} />
        </TouchableOpacity>
      )}
      {props.btnBack && (
        <TouchableOpacity onPress={navigation.goBack}>
          <Icon name="chevron-left" size={20} style={style.backIcon} />
        </TouchableOpacity>
      )}
      <View>
        <Text style={style.title}>{props.Title}</Text>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 0.4,
    borderBottomColor: '#cbcbcb',
    alignItems: 'center',
    paddingBottom: 35,
    paddingTop: 25,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins',
    fontWeight: 'bold',
    color: '#223263',
    marginLeft: 20,
  },
  backIcon: {
    color: '#666',
    marginLeft: 15,
  },
});
