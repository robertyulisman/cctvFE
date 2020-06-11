import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  RefreshControl,
} from 'react-native';
import Header from '../../components/Header';
import {useDispatch, useSelector} from 'react-redux';
import {
  getNewNotif,
  updateNewNotif,
} from '../../store/actions/userNotificationAction';
import FastImage from 'react-native-fast-image';
import isCloseToBottom from '../../helpers/isCloseBottom';
import EmptyData from '../../components/EmptyData';
import Axios from 'axios';
import {FlatList} from 'react-native-gesture-handler';
import {API_URL} from 'react-native-dotenv';

export default function Notification(props) {
  const dispatch = useDispatch();
  // const params = props.route.params;

  const dataNewNotif = useSelector((state) => state.userNewNotif);
  // console.log('aaaaaaaaaaaaaaaaaaaaa', dataNewNotif.data.length);
  const [dataNotif, setDataNotif] = React.useState([]);

  // testing

  // const jumlahStatus = Object.keys(dataNewNotif.data).filter(
  //   (keyHistory, i) => {
  //     const history = dataNewNotif.data[keyHistory];
  //     return history.status === 0;
  //   },
  // );

  // console.log('ini jumlah status', jumlahStatus.length);

  // const [refreshing, setRefreshing] = React.useState(false);
  // function wait(timeout) {
  //   return new Promise((resolve) => {
  //     setTimeout(resolve, timeout);
  //   });
  // }
  // const onRefreshing = React.useCallback(() => {
  //   setRefreshing(true);
  //   wait(200).then(async () => {
  //     await dispatch(getNewNotif());
  //     setRefreshing(false);
  //   });
  // }, [refreshing]);
  // const handleInfinityScroll = async ({nativeEvent}) => {
  //   if (isCloseToBottom(nativeEvent) && dataNewNotif.pagination.nextPage) {
  //     ToastAndroid.show('Load More ...', ToastAndroid.SHORT);
  //     dispatch(updateNewNotif(dataNewNotif.pagination.nextPage));
  //   }
  // };

  React.useEffect(() => {
    dispatch(getNewNotif());

    const status = 1; // status 1 artinya notif telah di baca;
    const id = [];
    const newData = [];
    const data = dataNewNotif.data.filter((item) => item.status === 0);

    for (let i = 0; i < data.length; i++) {
      id.push(data[i].id);
      newData.push(data[i]);
    }
    Axios.post(`${API_URL}api/notifications/${status}`, {
      // Axios.post(`http://192.168.100.2:5004/api/notifications/${status}`, {
      id: id,
    })
      .then((res) => {
        console.log('sukses ganti status', res.data);
        setDataNotif(newData);
      })
      .catch((err) => console.log('error ganti status', err));
  }, [dataNewNotif]);

  const handleBackPress = () => {
    props.navigation.navigate('Home');
    // const params = props.route.params;
    // params.onNavigateBack();
    // console.log('params', params);
  };
  return (
    <>
      <Header
        Title="Not Opened Notification"
        btnBackNew
        onPress={handleBackPress}
      />
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          paddingHorizontal: 15,
        }}>
        {dataNotif.length > 0 ? (
          <FlatList
            data={dataNotif}
            renderItem={({item}) => (
              <TouchableOpacity
                key={item.id}
                style={{
                  padding: 15,
                  borderWidth: 0.5,
                  borderColor: '#cbcbcb',
                  borderRadius: 5,
                  marginVertical: 5,
                  position: 'relative',
                }}>
                {item.status === 0 && (
                  <View
                    style={{
                      height: 10,
                      width: 10,
                      right: 10,
                      top: 0,
                      position: 'absolute',
                      borderRadius: 5,
                      backgroundColor: 'red',
                      alignSelf: 'flex-end',
                      marginTop: 10,
                    }}
                  />
                )}

                <View style={{flexDirection: 'row', marginBottom: 10}}>
                  <FastImage
                    source={{uri: item.lastImage}}
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
                      {item.cameraCCTV.name}
                    </Text>
                    <Text style={{color: '#666'}}>
                      {new Date(item.createdAt).toDateString()}{' '}
                      {new Date(item.createdAt).toLocaleTimeString()}
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
                        Detect {item.objectDetected || 'Motion'}
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
                          props.navigation.navigate('DetailNotificationImage', {
                            history: item,
                            type: 'from home',
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
                          props.navigation.navigate('DetailNotificationVideo', {
                            history: item,
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

                  {/* <Text style={{color: '#666', textAlign: 'right'}}>
                            status {history.status}
                          </Text> */}
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
            // extraData={selected}
          />
        ) : (
          <EmptyData />
        )}
      </View>
    </>
  );
}
