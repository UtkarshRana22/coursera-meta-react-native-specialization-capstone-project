import { StyleSheet, Text, Button, TouchableOpacity, View } from 'react-native';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView, useBottomSheetModal } from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback, useMemo } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';



export type Ref = BottomSheetModal;
const BottomSheet = forwardRef<Ref>((props, ref) => {
  const snapPoint = useMemo(() => ['50%'], []);
  const renderBackdrop = useCallback((props: any) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />, []);
  const { dismiss } = useBottomSheetModal();

  return (
    <BottomSheetModal
      backgroundStyle={{ backgroundColor: 'white', borderRadius: 0 }}
      overDragResistanceFactor={0}
      backdropComponent={renderBackdrop}
      ref={ref}
      snapPoints={snapPoint}>
      <BottomSheetView style={styles.btmView}>

        <View style={styles.toggleContainer}>
          <TouchableOpacity style={[styles.toggleBtn, styles.togglebtnActive]}>
            <Text style={styles.btnTxt}>Delivery</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.toggleBtn, styles.togglebtnInActive]}>
            <Text style={styles.btnTxt}>Pickup</Text>
          </TouchableOpacity>
        </View>


        <Text style={styles.subHeader}>Location</Text>
        <Link href={'/(modal)/location-search'} asChild>
          <TouchableOpacity>
            <View style={styles.subActionContainer}>
              <Ionicons name="location-outline" size={21} color={'lightskyblue'} />
              <Text style={styles.subAction}>
                Current Location
              </Text>
              <Ionicons name="chevron-forward" size={21} color={'lightskyblue'} />
            </View>
          </TouchableOpacity>
        </Link>

        <Text style={styles.subHeader}>Arrival Time</Text>
        <Link href={'/'} asChild>
          <TouchableOpacity>
            <View style={[styles.subActionContainer, styles.lastContainer]}>
              <Ionicons name="time-outline" size={21} color={'lightskyblue'} />
              <Text style={styles.subAction}>
                Now
              </Text>
              <Ionicons name="chevron-forward" size={21} color={'lightskyblue'} />
            </View>
          </TouchableOpacity>
        </Link>

        <TouchableOpacity style={styles.btn} onPress={() => dismiss()} >
          <Text style={styles.btnTxt}>Confirm</Text>
        </TouchableOpacity>

      </BottomSheetView>
    </BottomSheetModal>
  )
});

export default BottomSheet;

const styles = StyleSheet.create({
  btmView: {
    flex: 1,
    height: 300
  },
  btn: {

  },
  btnTxt: {
    color: 'white'
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    padding: 10
  },
  toggleBtn: {
    fontSize: 48,
    paddingHorizontal: 33,
    borderRadius: 30,
    padding: 10,
    marginBottom: 10
  },
  togglebtnActive: {
    backgroundColor: 'skyblue',
  },
  togglebtnInActive: {
    backgroundColor: 'lightskyblue'
  },
  subHeader: {
    fontSize: 16,
    fontWeight: '600',
    alignSelf: 'flex-start',
    marginLeft: 20
  },
  subActionContainer: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: 'white',
    padding: 10,
    marginTop: 7.5,
    marginBottom: 7.5,
    borderWidth: 0.5,
    borderBlockColor: 'lightgrey'
  },
  subAction: {
    fontSize: 16,
    flex: 1
  },
  lastContainer: {
    marginBottom: 10
  }
})