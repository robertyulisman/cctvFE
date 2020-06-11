import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
export default function HistoryCard(props) {
  const navigation = useNavigation();
  const history = props.history;
  console.log('ini historizzzzz', history.lastImage);
  return (
    <View
      style={{
        padding: 15,
        borderWidth: 0.5,
        borderColor: '#cbcbcb',
        borderRadius: 5,
        marginVertical: 5,
      }}>
      <View style={{flexDirection: 'row', marginBottom: 10}}>
        <FastImage
          source={
            history.lastImage !== null && history.lastImage !== ''
              ? {uri: history.lastImage}
              : require('../../assets/icons/camera.png')
          }
          resizeMode="contain"
          style={{height: 50, width: 80, marginRight: 15}}
        />
        <View>
          <Text
            style={{
              fontSize: 19,
              fontWeight: 'bold',
              color: '#223263',
              fontFamily: 'Poppins',
            }}>
            {history.cameraCCTV.name}
          </Text>
          <Text style={{color: '#666'}}>
            {new Date(history.createdAt).toDateString()}{' '}
            {new Date(history.createdAt).toLocaleTimeString()}
          </Text>
        </View>
      </View>
      <View style={{paddingHorizontal: 15}}>
        <View style={{flexDirection: 'row', marginVertical: 5}}>
          <View style={{flex: 1}}>
            <Text style={{color: '#666'}}>Desc</Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={{textAlign: 'right', color: '#333'}}>
              Detect {history.objectDetected || 'Motion'}
            </Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', marginVertical: 5}}>
          <View style={{flex: 1}}>
            <Text style={{color: '#666'}}>image</Text>
          </View>
          <View style={{flex: 1}}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('DetailNotificationImage', {
                  history,
                })
              }>
              <Text
                style={{
                  textAlign: 'right',
                  color: '#40BFFF',
                  fontWeight: 'bold',
                }}>
                Show
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{flexDirection: 'row', marginVertical: 5}}>
          <View style={{flex: 1}}>
            <Text style={{color: '#666'}}>Video</Text>
          </View>
          <View style={{flex: 1}}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('DetailNotificationVideo', {
                  history,
                })
              }>
              <Text
                style={{
                  textAlign: 'right',
                  color: '#40BFFF',
                  fontWeight: 'bold',
                }}>
                Show
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
