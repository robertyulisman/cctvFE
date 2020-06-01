import React from 'react';
import {StyleSheet, View, Text, ActivityIndicator} from 'react-native';
import {useSelector} from 'react-redux';
export default function Loading(props) {
  const {isLoading} = useSelector((state) => state);
  return (
    <>
      {isLoading && (
        <View style={style.container}>
          <ActivityIndicator size={30} color="#40BFFF" />
        </View>
      )}
    </>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
