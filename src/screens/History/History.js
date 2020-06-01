import React from 'react';
import {
  View,
  Text,
  ScrollView,
  ToastAndroid,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import Header from '../../components/Header';
import {useDispatch, useSelector} from 'react-redux';
import {
  getUserHistory,
  updateUserHistory,
} from '../../store/actions/userHistoryAction';
import isCloseToBottom from '../../helpers/isCloseBottom';
import HistoryCard from './HistoryCard';
import Icons from 'react-native-vector-icons/FontAwesome5';
import {getData} from '../../helpers/CRUD';
import {API_URL} from 'react-native-dotenv';
import EmptyData from '../../components/EmptyData';
export default function History(props) {
  const scrollref = React.useRef(null);
  const dispatch = useDispatch();
  const dataHistory = useSelector((state) => state.userHistory);
  const [isCameraHistory, setIsCameraHistory] = React.useState();
  const [dataCameraHistory, setDataCameraHistory] = React.useState({
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
      if (props.route.params && props.route.params.CCTVId) {
        await getCameraHistory();
      } else {
        await dispatch(getUserHistory());
      }
      setRefreshing(false);
    });
  }, [refreshing, props.route.params]);

  const handleInfinityScroll = async ({nativeEvent}) => {
    if (isCloseToBottom(nativeEvent)) {
      if (!isCameraHistory && dataHistory.pagination.nextPage) {
        // ToastAndroid.show('Load More ...', ToastAndroid.SHORT);
        dispatch(updateUserHistory(dataHistory.pagination.nextPage));
      } else if (isCameraHistory && dataCameraHistory.pagination.nextPage) {
        // ToastAndroid.show('Load More ...', ToastAndroid.SHORT);
        updateCameraHistory(dataCameraHistory.pagination.nextPage);
      }
    }
  };
  const getCameraHistory = async () => {
    try {
      const response = await getData(
        `/camera-cctv/${props.route.params.CCTVId}`,
      );
      if (response.data && response.data.success) {
        setDataCameraHistory({
          data:
            response.data.CCTVNotifications &&
            response.data.CCTVNotifications.length > 0
              ? response.data.CCTVNotifications.reduce(
                  (dataCamera, historyNotif) => ({
                    ...dataCamera,
                    [`_${historyNotif.id}_`]: {
                      cameraCCTV: {
                        name: response.data.name,
                      },
                      ...historyNotif,
                    },
                  }),
                  {},
                )
              : {},
          pagination: response.data.pagination || {},
        });
      }
    } catch (err) {
      if (!(err.message === 'Network Error')) {
        throw err;
      }
    }
  };
  const updateCameraHistory = async (url) => {
    try {
      const response = await getData(url.replace(API_URL + 'api/', ''));
      // const response = await getData(
      //   url.replace('http://192.168.100.2:5004/' + 'api/', ''),
      // );

      if (response.data && response.data.success) {
        if (
          response.data.CCTVNotifications &&
          response.data.CCTVNotifications.length > 0
        ) {
          setDataCameraHistory((prevData) => ({
            ...prevData,
            data: {
              ...prevData.data,
              ...response.data.CCTVNotifications.reduce(
                (dataCamera, historyNotif) => ({
                  ...dataCamera,
                  [`_${historyNotif.id}_`]: {
                    cameraCCTV: {
                      name: response.data.name,
                    },
                    ...historyNotif,
                  },
                }),
                {},
              ),
            },
            pagination: response.data.pagination,
          }));
        }
      }
    } catch (err) {
      if (!(err.message === 'Network Error')) {
        throw err;
      }
    }
  };

  React.useEffect(() => {
    if (props.route.params && props.route.params.CCTVId) {
      setDataCameraHistory({data: {}, pagination: {}});
      setIsCameraHistory(true);
      getCameraHistory();
    }
    dispatch(getUserHistory());
  }, [props.route.params]);
  return (
    <>
      <Header Title="History" btnBack={false} />
      <View
        style={{
          paddingHorizontal: 15,
          flex: 1,
          backgroundColor: '#fff',
        }}>
        {isCameraHistory && (
          <View
            style={{
              flexDirection: 'row',
              marginVertical: 15,
              elevation: 3,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontFamily: 'Poppins',
                fontSize: 20,
                color: '#223263',
                fontWeight: 'bold',
                marginRight: 15,
              }}>
              History {props.route.params.CCTVname}
            </Text>
            <TouchableOpacity
              onPress={() => {
                scrollref.current.scrollTo({x: 0, y: 0});
                setDataCameraHistory({data: {}, pagination: {}});
                setIsCameraHistory(false);
              }}>
              <Icons name="times" size={20} color="red" />
            </TouchableOpacity>
          </View>
        )}
        <ScrollView
          ref={scrollref}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefreshing} />
          }
          showsVerticalScrollIndicator={false}
          onScroll={handleInfinityScroll}
          style={{paddingTop: 30}}>
          <View style={{paddingBottom: 80}}>
            {!isCameraHistory &&
              Object.keys(dataHistory.data).length > 0 &&
              Object.keys(dataHistory.data).map((keyHistory) => {
                const history = dataHistory.data[keyHistory];
                return <HistoryCard key={keyHistory} history={history} />;
              })}

            {isCameraHistory &&
              Object.keys(dataCameraHistory.data).length > 0 &&
              Object.keys(dataCameraHistory.data).map((keyHistory) => {
                const history = dataCameraHistory.data[keyHistory];
                return <HistoryCard key={keyHistory} history={history} />;
              })}
            {((!isCameraHistory && Object.keys(dataHistory.data).length <= 0) ||
              (isCameraHistory &&
                Object.keys(dataCameraHistory.data).length <= 0)) && (
              <EmptyData />
            )}
          </View>
        </ScrollView>
      </View>
    </>
  );
}
