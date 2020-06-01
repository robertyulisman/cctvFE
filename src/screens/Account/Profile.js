import React from 'react';
import {View, Text, ScrollView, Image} from 'react-native';
import Header from '../../components/Header';
import {Button} from 'react-native-elements';
import {Avatar} from 'react-native-elements';
import {useSelector} from 'react-redux';
import DataUser from './Components/DataUser';
import Icons from 'react-native-vector-icons/FontAwesome5';
import {API_URL} from 'react-native-dotenv';
export default function Profile(props) {
  const {dataProfile} = useSelector((state) => state.userData);
  return (
    <>
      <Header Title="Profile" btnBack={true} />
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
                  ? // ?
                    {uri: `${API_URL}${dataProfile.picture}`}
                  : // {uri: `http://192.168.100.2:5004/${dataProfile.picture}`}
                    require('../../assets/icons/userImage.png')
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
          <View style={{paddingHorizontal: 12, marginBottom: 20}}>
            <DataUser
              field="Gender"
              icon="user"
              value={dataProfile.gender || 'NotSet'}
            />
            <DataUser
              field="Email"
              icon="envelope"
              value={dataProfile.email || 'NotSet'}
            />
            <DataUser
              field="No Handphone"
              icon="mobile"
              value={dataProfile.noHandPhone || 'NotSet'}
            />
            <DataUser
              field="Address"
              icon="elementor"
              value={dataProfile.address || 'NotSet'}
            />
          </View>
          <Button
            onPress={() => props.navigation.navigate('ProfileUpdate')}
            title="Change Profile"
            icon={<Icons name="pen" size={16} color="#fff" />}
            buttonStyle={{
              marginVertical: 5,
              height: 54,
              borderRadius: 5,
              backgroundColor: '#40BFFF',
              elevation: 2,
            }}
            titleStyle={{
              marginLeft: 10,
              fontSize: 16,
              fontWeight: 'bold',
              fontFamily: 'Poppins',
            }}
          />
          <Button
            title="Change Password"
            onPress={() => props.navigation.navigate('ChangePassword')}
            icon={<Icons name="key" size={16} color="#fff" />}
            buttonStyle={{
              marginVertical: 5,
              height: 54,
              borderRadius: 5,
              backgroundColor: '#aaa',
              elevation: 2,
            }}
            titleStyle={{
              marginLeft: 10,
              fontSize: 16,
              fontWeight: 'bold',
              fontFamily: 'Poppins',
            }}
          />
        </ScrollView>
      </View>
    </>
  );
}
