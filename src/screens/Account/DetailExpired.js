import React from 'react';
import {View, Text, ScrollView, Image} from 'react-native';
import Header from '../../components/Header';
import {Button} from 'react-native-elements';
import {Avatar} from 'react-native-elements';
import DataUser from './Components/DataUser';
import Icons from 'react-native-vector-icons/FontAwesome5';
import {useSelector} from 'react-redux';
import {API_URL} from 'react-native-dotenv';
export default function Profile(props) {
  const {dataProfile} = useSelector((state) => state.userData);
  const dataCamera = useSelector((state) => state.userCamera);
  return (
    <>
      <Header Title="Subscribe Status" btnBack={true} />
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          paddingHorizontal: 15,
        }}>
        <ScrollView
          style={{paddingTop: 25}}
          showsVerticalScrollIndicator={false}>
          <View style={{flexDirection: 'row', padding: 5, marginBottom: 25}}>
            <Avatar
              rounded
              source={
                dataProfile.picture
                  
                  ? {uri: `${API_URL}${dataProfile.picture}`}
                    // {uri: `http://192.168.100.2:5004/${dataProfile.picture}`}
                  : require('../../assets/icons/userImage.png')
              }
              size={78}
              containerStyle={{
                elevation: 2,
              }}
              overlayContainerStyle={{backgroundColor: '#fff'}}
            />
            <View style={{marginLeft: 20}}>
              <Text
                style={{
                  fontFamily: 'Poppins',
                  fontSize: 18,
                  color: '#223263',
                  fontWeight: 'bold',
                  marginVertical: 5,
                }}>
                {dataProfile.username}
              </Text>
              <Text
                style={{
                  fontFamily: 'Poppins',
                  fontSize: 12,
                  color: '#777',
                }}>
                {dataProfile.firstName
                  ? `${dataProfile.firstName} ${dataProfile.lastName}`
                  : 'NotSet'}
              </Text>
            </View>
          </View>
          <View>
            <Text
              style={{
                fontSize: 18,
                marginTop: 20,
                fontWeight: 'bold',
                color: '#223263',
                fontFamily: 'Poppins',
              }}>
              Detail Subscribed
            </Text>
          </View>
          <View style={{paddingHorizontal: 15}}>
            <View style={{flexDirection: 'row', marginVertical: 10}}>
              <View style={{flex: 1}}>
                <Text style={{color: '#666'}}>Total Camera</Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={{textAlign: 'right', color: '#333'}}>
                  {dataCamera.pagination.totalEntries || 0}
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', marginVertical: 5}}>
              <View style={{flex: 1}}>
                <Text style={{color: '#666'}}>Expired At</Text>
              </View>
              <View style={{flex: 1}}>
                <Text
                  style={{
                    textAlign: 'right',
                    color: '#40BFFF',
                    fontWeight: 'bold',
                  }}>
                  {new Date(dataProfile.subscribeExpired).toDateString()}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}
