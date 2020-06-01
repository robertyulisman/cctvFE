import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  RefreshControl,
} from 'react-native';
import {Input} from 'react-native-elements';
import Icons from 'react-native-vector-icons/FontAwesome5';
import {useDispatch, useSelector} from 'react-redux';
import {
  getUserCamera,
  updateDataUserCamera,
} from '../../store/actions/userCameraAction';
import {getNewNotif} from '../../store/actions/userNotificationAction';

import isCloseToBottom from '../../helpers/isCloseBottom';
import CameraCard from './CameraCard';
import {getData} from '../../helpers/CRUD';
import {API_URL} from 'react-native-dotenv';
import {runNavigate} from '../../store/actions/queueNavigate';
import EmptyData from '../../components/EmptyData';
export default function Home(props) {
  const dataNewNotif = useSelector((state) => state.userNewNotif);
  // const dataNotification = dataNewNotif.data.filter(
  //   (item) => item.status === 0,
  // );
  const dispatch = useDispatch();
  const dataCamera = useSelector((state) => state.userCamera);
  const dataqueu = useSelector((state) => state.queueNavigate);
  const [searchText, setSearchText] = React.useState('');
  const [isSearch, setIsSearch] = React.useState(false);
  const [dataSearchCamera, setDataSearchCamera] = React.useState({
    data: {},
    pagination: {},
  });
  const [refreshing, setRefreshing] = React.useState(false);
  function wait(timeout) {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  }

  const onRefreshing = React.useCallback(() => {
    setRefreshing(true);
    wait(200).then(async () => {
      setIsSearch(false);
      setSearchText('');
      await dispatch(getUserCamera());
      await dispatch(getNewNotif());

      setRefreshing(false);
    });
  }, [refreshing]);
  const handleSearch = async (name) => {
    setSearchText(name);
    if (name.length > 3) {
      setIsSearch(true);
      getSearchCamera(name);
    } else if (name.length === 0) {
      setIsSearch(false);
    }
  };
  const handleInfinityScroll = async ({nativeEvent}) => {
    if (isCloseToBottom(nativeEvent)) {
      if (!isSearch && dataCamera.pagination.nextPage) {
        ToastAndroid.show('Load More ...', ToastAndroid.SHORT);
        dispatch(updateDataUserCamera(dataCamera.pagination.nextPage));
      } else if ((isSearch, dataSearchCamera.pagination.nextPage)) {
        ToastAndroid.show('Load More ...', ToastAndroid.SHORT);
        updateSearchCamera(dataSearchCamera.pagination.nextPage);
      }
    }
  };
  const getSearchCamera = async (name) => {
    try {
      const response = await getData(`camera-cctv/?search=${name}`);
      if (response.data && response.data.success) {
        setDataSearchCamera({
          data:
            response.data.data && response.data.data.length > 0
              ? response.data.data.reduce(
                  (dataSearch, camera) => ({
                    ...dataSearch,
                    [`_${camera.id}_`]: camera,
                  }),
                  {},
                )
              : {},
          pagination: response.data.pagination || {},
        });
      }
    } catch (err) {
      console.log(err);
      if (!(err.message === 'Network Error')) {
        throw err;
      }
    }
  };
  const updateSearchCamera = async (url) => {
    try {
      const response = await getData(url.replace(API_URL + 'api/', ''));
      if (response.data && response.data.success) {
        setDataSearchCamera((prevData) => ({
          ...prevData,
          data: {
            ...prevData.data,
            ...response.data.data.reduce(
              (dataSearch, camera) => ({
                ...dataSearch,
                [`_${camera.id}_`]: camera,
              }),
              {},
            ),
          },
          pagination: response.data.pagination,
        }));
      }
    } catch (err) {
      if (!(err.message === 'Network Error')) {
        throw err;
      }
    }
  };

  // handle BADGE disini =====>>>>>
  const [badge, setBadge] = React.useState(0);

  React.useEffect(() => {
    const jumlahUnredNotif = Object.keys(dataNewNotif.data).filter(
      (keyHistory, i) => {
        const history = dataNewNotif.data[keyHistory];
        return history.status === 0;
      },
    );

    setBadge(jumlahUnredNotif.length);
    console.log('badge', jumlahUnredNotif.length);
    // console.log('notification', Object.keys(dataNewNotif.data));
    dispatch(getUserCamera());
    if (dataqueu.name) {
      props.navigation.navigate(dataqueu.name, dataqueu.params);
      dispatch(runNavigate());
    }
    return () => {
      dispatch(runNavigate());
    };
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <View
        style={{
          height: 100,
          paddingTop: 10,
          paddingHorizontal: 10,
          flexDirection: 'row',
          alignItems: 'center',
          borderBottomWidth: 0.4,
          borderBottomColor: '#cbcbcb',
        }}>
        <View style={{paddingHorizontal: 10, flex: 1}}>
          <Input
            onChangeText={(text) => handleSearch(text)}
            value={searchText}
            placeholder="Search Camera ..."
            placeholderTextColor="#9098B1"
            leftIcon={
              <Icons
                name="search"
                size={18}
                style={{color: '#40BFFF', fontWeight: '200'}}
              />
            }
            containerStyle={{
              borderRadius: 5,
              borderWidth: 0.4,
              borderColor: '#cbcbcb',
              padding: -2,
            }}
            inputContainerStyle={{
              borderBottomWidth: 0,
              width: '100%',
            }}
            inputStyle={{
              paddingLeft: 15,
              fontFamily: 'Poppins',
              fontSize: 15,
              marginRight: 0,
            }}
          />
        </View>
        <View style={{width: 30, marginLeft: 5}}>
          {badge > 0 && (
            <View
              style={{
                position: 'absolute',
                zIndex: 999,
                top: -12,
                right: 0,
                height: 18,
                width: 18,
                padding: 5,
                backgroundColor: 'red',
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>{badge}</Text>
            </View>
          )}

          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate(
                'Notification' /*, {
                onNavigateBack: onRefreshing,
              } */,
              )
            }>
            <Icons name="bell" size={25} style={{color: '#999'}} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{paddingHorizontal: 15, paddingTop: 30, flex: 1}}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefreshing} />
          }
          onScroll={handleInfinityScroll}>
          <Text
            style={{
              fontFamily: 'Poppins',
              fontSize: 20,
              color: '#223263',
              fontWeight: 'bold',
              marginBottom: 40,
            }}>
            Avaible Camera
          </Text>
          <View style={{paddingBottom: 80}}>
            {!isSearch &&
              Object.keys(dataCamera.data).length > 0 &&
              Object.keys(dataCamera.data).map((keyCamera) => {
                const camera = dataCamera.data[keyCamera];
                return <CameraCard key={keyCamera} camera={camera} />;
              })}
            {isSearch &&
              Object.keys(dataSearchCamera.data).length > 0 &&
              Object.keys(dataSearchCamera.data).map((keyCamera) => {
                const camera = dataSearchCamera.data[keyCamera];
                return <CameraCard key={keyCamera} camera={camera} />;
              })}
            {((!isSearch && Object.keys(dataCamera.data).length <= 0) ||
              (isSearch && Object.keys(dataSearchCamera.data).length <= 0)) && (
              <EmptyData />
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
const style = StyleSheet.create({
  btnStyle: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    marginHorizontal: 4,
  },
});
