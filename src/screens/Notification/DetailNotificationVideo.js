import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  BackHandler,
  StatusBar,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Header from '../../components/Header';
import {getData} from '../../helpers/CRUD';
import {API_URL} from 'react-native-dotenv';
import Orientation from 'react-native-orientation-locker';
import socket from 'socket.io-client';
const io = socket(API_URL, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: Infinity,
});
import ShowVideo from './Video.js';
export default function DetailNotification(props) {
  const {history} = props.route.params;
  const {type} = props.route.params;
  const [sourceNotif, setSourceNotif] = React.useState([]);
  const [isVideoFull, setIsVideoFull] = React.useState(false);
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
      const response = await getData(`notifications/${history.id}/video`);
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
  async function handleFullscreen() {
    if (isVideoFull) {
      setIsVideoFull(false);
      StatusBar.setHidden(false);
      Orientation.unlockAllOrientations();
    } else {
      setIsVideoFull(true);
      StatusBar.setHidden(true);
      Orientation.lockToLandscapeLeft();
    }
  }
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (isVideoFull) {
          Orientation.unlockAllOrientations();
          setIsVideoFull(false);
          return true;
        } else {
          return false;
        }
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [isVideoFull, setIsVideoFull]),
  );
  React.useEffect(() => {
    if (parseInt(history.status) < 2) {
      io.emit('notif-read-success', history.id);
    }

    getSourceNotification();
  }, [history.id]);
  return (
    <>
      {!isVideoFull && <Header Title="Detail Notification" btnBack={true} />}
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        {!isVideoFull && (
          <View
            style={{
              backgroundColor: '#fff',
              paddingHorizontal: 20,
              paddingTop: 30,
              marginBottom: 10,
            }}>
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefreshing}
                />
              }>
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
                  props.navigation.navigate('DetailNotificationImage', {
                    history,
                  })
                }>
                <Text style={{color: 'red', fontWeight: 'bold'}}>
                  Show Images
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}
        {sourceNotif.length > 0 && (
          <ShowVideo
            uri={sourceNotif[0].uri}
            poster={history.lastImage}
            fullscreen={isVideoFull}
            setIsVideoFull={setIsVideoFull}
            handleFullscreen={handleFullscreen}
          />
        )}
      </View>
    </>
  );
}
