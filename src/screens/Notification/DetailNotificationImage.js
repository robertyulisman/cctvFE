import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ToastAndroid,
  RefreshControl,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import ImageView from 'react-native-image-viewing';
import Header from '../../components/Header';
import {useSelector} from 'react-redux';
import {getData} from '../../helpers/CRUD';
import {ScrollView} from 'react-native-gesture-handler';
import {API_URL} from 'react-native-dotenv';
import socket from 'socket.io-client';
const io = socket(API_URL, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: Infinity,
});
export default function DetailNotification(props) {
  const {history} = props.route.params;
  const {type} = props.route.params;
  console.log('params', history);
  console.log('type', type);
  const [sourceNotif, setSourceNotif] = React.useState([]);
  const [previewImage, setPreviewImage] = React.useState(false);
  const [indexImage, setIndexImage] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  function wait(timeout) {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  }
  const onRefreshing = React.useCallback(() => {
    setRefreshing(true);
    wait(200).then(async () => {
      await getSourceNotification();
      setRefreshing(false);
    });
  }, [refreshing]);
  const getSourceNotification = async () => {
    try {
      const response = await getData(`notifications/${history.id}/image`);
      // console.log('respon data', response.data);
      if (response.data && response.data.success) {
        setSourceNotif(
          response.data.data.map((d) => ({
            uri: d.source,
          })),
        );
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleClickImage = (index) => {
    setIndexImage(index), setPreviewImage(true);
  };

  React.useEffect(() => {
    //   if (parseInt(history.status) < 2) {
    //     io.emit('notif-read-success', history.id);
    //   }
    getSourceNotification();
  }, [history.id]);

  return (
    <>
      <Header Title="Detail Notification" btnBack={true} />
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <View
          style={{
            backgroundColor: '#fff',
            paddingHorizontal: 20,
            paddingTop: 30,
            marginBottom: 10,
          }}>
          <View>
            <Text
              style={{
                fontSize: 19,
                fontWeight: 'bold',
                color: '#223263',
                fontFamily: 'Poppins',
              }}>
              {type === 'from fcm'
                ? history.cameraCCTV
                : history.cameraCCTV.name}
            </Text>
            <Text style={{color: '#666'}}>
              Detect at {new Date(history.createdAt).toDateString()}{' '}
              {new Date(history.createdAt).toLocaleTimeString()}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate('DetailNotificationVideo', {
                history,
                type
              })
            }>
            <Text style={{color: 'red', fontWeight: 'bold'}}>Show Videos</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 1,
            marginTop: 15,
            backgroundColor: '#fff',
          }}>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefreshing}
              />
            }
            showsVerticalScrollIndicator={false}>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
              }}>
              {sourceNotif.map((d, i) => (
                <View style={{margin: 10}} key={i}>
                  <TouchableOpacity onPress={() => handleClickImage(i)}>
                    <FastImage
                      source={{
                        ...d,
                        priority: FastImage.priority.normal,
                      }}
                      style={{width: 280, height: 200}}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
      {sourceNotif.length > 0 && (
        <ImageView
          images={sourceNotif}
          visible={previewImage}
          imageIndex={indexImage}
          presentationStyle="overFullScreen"
          onRequestClose={() => setPreviewImage(false)}
        />
      )}
    </>
  );
}
