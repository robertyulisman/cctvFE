import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {Image, Button} from 'react-native-elements';
import {useDispatch} from 'react-redux';
import {userLogout} from '../../store/actions/userDataAction';
export default function Unpaid(props) {
  const dispatch = useDispatch();
  return (
    <View style={style.container}>
      <View style={style.header}>
        <Image
          source={require('../../assets/icons/AlertIcon.png')}
          style={{
            width: 87,
            height: 122.17,
          }}
        />
        <Text style={style.headerText}>Can't Login</Text>
        <Text style={style.headerQuotes}>Unpaid or Subscribe Expired</Text>
      </View>
      <View>
        <Button
          title="Sig in to another account"
          buttonStyle={style.login}
          titleStyle={{
            fontSize: 16,
            fontWeight: 'bold',
            fontFamily: 'Poppins',
          }}
          onPress={() => dispatch(userLogout())}
        />
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
  },
  headerText: {
    fontFamily: 'Poppins',
    color: '#223263',
    marginTop: -20,
    marginBottom: 20,
    fontSize: 26,
    fontWeight: 'bold',
  },
  headerQuotes: {
    color: '#9098B1',
    fontSize: 14,
  },
  login: {
    width: '100%',
    marginVertical: 20,
    height: 54,
    borderRadius: 5,
    backgroundColor: '#40BFFF',
    elevation: 4,
  },
});
