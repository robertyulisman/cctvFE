import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Input, Button, CheckBox} from 'react-native-elements';
import Header from '../../components/Header';
import {useDispatch} from 'react-redux';
import {startLoading, endLoading} from '../../store/actions/loading';
import CustomAlert from '../../components/CustomAlert';
import {submitData} from '../../helpers/CRUD';
import {getUserCamera} from '../../store/actions/userCameraAction';
export default function AlarmConfig(props) {
  const {alarmSchedule} = props.route.params;
  const dispatch = useDispatch();
  const [alarmActive, setAlarmActive] = React.useState(
    alarmSchedule ? alarmSchedule.isOn : false,
  );
  const [listDay, setListDay] = React.useState(
    alarmSchedule
      ? alarmSchedule.listDay.split(',').map((v) => parseInt(v))
      : [],
  );
  const [listHour, setListHour] = React.useState(
    alarmSchedule
      ? alarmSchedule.listHour.split(',').map((v) => parseInt(v))
      : [],
  );
  const handleClickDay = (day) => {
    let listNow = [...listDay];
    if (listNow.includes(day)) {
      listNow.splice(listNow.indexOf(day), 1);
    } else {
      listNow.push(day);
    }
    setListDay(listNow);
  };
  const handleClickHour = (hour) => {
    let listNow = [...listHour];
    if (listNow.includes(hour)) {
      listNow.splice(listNow.indexOf(hour), 1);
    } else {
      listNow.push(hour);
    }
    setListHour(listNow);
  };
  const handleCheckHour = () => {
    if (!(listHour.length === 24)) {
      setListHour([...Array(24).keys()]);
    } else {
      setListHour([]);
    }
  };
  const handleCheckDay = () => {
    if (!(listDay.length === 7)) {
      setListDay([...Array(7).keys()]);
    } else {
      setListDay([]);
    }
  };
  const handleApplyConfig = async () => {
    dispatch(startLoading());
    try {
      let strListDay, strListHour;
      if (listHour.length === 0) {
        if (alarmActive) {
          handleClickHour(new Date().getHours());
        }
        strListHour = String(new Date().getHours());
      } else {
        strListHour = listHour
          .sort((a, b) => {
            return a - b;
          })
          .join(',');
      }
      if (listDay.length === 0) {
        if (alarmActive) {
          handleClickDay(new Date().getDay());
        }
        strListDay = String(new Date().getDay());
      } else {
        strListDay = listDay
          .sort((a, b) => {
            return a - b;
          })
          .join(',');
      }
      const response = await submitData('schedule', {
        CCTVId: props.route.params.CCTVId,
        isOn: alarmActive ? 1 : 0,
        listDay: strListDay,
        listHour: strListHour,
      });
      if (response.data && response.data.success) {
        dispatch(getUserCamera());
        props.navigation.goBack();
        CustomAlert(response.data.success, response.data.msg);
      } else {
        CustomAlert(response.data.success, response.data.msg);
      }
    } catch (err) {
      if (!(err.message === 'Network Error')) {
        if (err.response) {
          CustomAlert(err.response.data.success, err.response.data.msg);
        }
      }
    }
    dispatch(endLoading());
  };
  return (
    <>
      <Header Title="Configuration" btnBack={true} />
      <View
        style={{
          flex: 1,
          paddingHorizontal: 15,
          paddingTop: 40,
          backgroundColor: '#fff',
        }}>
        <View style={{marginBottom: 25}}>
          <Text
            style={{
              fontFamily: 'Poppins',
              fontSize: 20,
              color: '#223263',
              fontWeight: 'bold',
              marginBottom: 10,
            }}>
            Condition
          </Text>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={() => setAlarmActive(true)}>
              <View style={alarmActive ? style.btnONOFFActive : style.btnONOFF}>
                <Text>ON</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setAlarmActive(false)}>
              <View
                style={!alarmActive ? style.btnONOFFActive : style.btnONOFF}>
                <Text>OFF</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{marginBottom: 25}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: 'Poppins',
                fontSize: 20,
                color: '#223263',
                fontWeight: 'bold',
                marginBottom: 10,
                flex: 1,
              }}>
              Hour
            </Text>
            <CheckBox
              title="All Hour"
              onPress={handleCheckHour}
              checked={listHour.length === 24}
              containerStyle={{
                padding: 0,
                backgroundColor: '#fff',
                borderWidth: 0,
                flex: 1,
                alignItems: 'flex-end',
              }}
            />
          </View>
          <View style={{flexDirection: 'row'}}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              <View style={{flexDirection: 'row'}}>
                {[...Array(24).keys()].map((v) => (
                  <TouchableOpacity key={v} onPress={() => handleClickHour(v)}>
                    <View
                      style={
                        listHour.includes(v) ? style.btnDayActive : style.btnDay
                      }>
                      <Text>{String('0' + v).slice(-2)}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
        <View style={{marginBottom: 25}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: 'Poppins',
                fontSize: 20,
                color: '#223263',
                fontWeight: 'bold',
                marginBottom: 10,
                flex: 1,
              }}>
              Day
            </Text>
            <CheckBox
              title="All Day"
              onPress={handleCheckDay}
              checked={listDay.length === 7}
              containerStyle={{
                padding: 0,
                backgroundColor: '#fff',
                borderWidth: 0,
                flex: 1,
                alignItems: 'flex-end',
              }}
            />
          </View>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity onPress={() => handleClickDay(0)}>
                <View
                  style={
                    listDay.includes(0) ? style.btnDayActive : style.btnDay
                  }>
                  <Text style={{color: 'red'}}>M</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleClickDay(1)}>
                <View
                  style={
                    listDay.includes(1) ? style.btnDayActive : style.btnDay
                  }>
                  <Text>S</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleClickDay(2)}>
                <View
                  style={
                    listDay.includes(2) ? style.btnDayActive : style.btnDay
                  }>
                  <Text>S</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleClickDay(3)}>
                <View
                  style={
                    listDay.includes(3) ? style.btnDayActive : style.btnDay
                  }>
                  <Text>R</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleClickDay(4)}>
                <View
                  style={
                    listDay.includes(4) ? style.btnDayActive : style.btnDay
                  }>
                  <Text>K</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleClickDay(5)}>
                <View
                  style={
                    listDay.includes(5) ? style.btnDayActive : style.btnDay
                  }>
                  <Text>J</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleClickDay(6)}>
                <View
                  style={
                    listDay.includes(6) ? style.btnDayActive : style.btnDay
                  }>
                  <Text>S</Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
      <View
        style={{
          position: 'absolute',
          alignItems: 'center',
          flex: 1,
          width: '100%',
          bottom: 0,
          left: 0,
          right: 0,
        }}>
        <Button
          onPress={handleApplyConfig}
          title="Apply"
          containerStyle={{
            width: '95%',
          }}
          buttonStyle={style.btnApply}
          titleStyle={{
            fontSize: 16,
            fontWeight: 'bold',
            fontFamily: 'Poppins',
          }}
        />
      </View>
    </>
  );
}
const rectStyle = {
  padding: 20,
  borderWidth: 1.5,
  marginHorizontal: 3,
  borderRadius: 5,
  borderColor: '#cbcbcb',
};
const style = StyleSheet.create({
  btnONOFF: {
    ...rectStyle,
  },
  btnONOFFActive: {
    ...rectStyle,
    borderWidth: 1.5,
    borderColor: '#40BFFF',
  },
  inputContainerStyle: {
    ...rectStyle,
    flex: 1,
    padding: 0,
  },
  btnDay: {
    ...rectStyle,
    justifyContent: 'center',
    padding: 20,
    paddingVertical: 30,
    flex: 1,
  },
  btnDayActive: {
    ...rectStyle,
    padding: 20,
    paddingVertical: 30,
    justifyContent: 'center',
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#40BFFF',
  },
  btnApply: {
    width: '100%',
    marginVertical: 20,
    height: 54,
    borderRadius: 5,
    backgroundColor: '#40BFFF',
    elevation: 4,
  },
});
