// import {createStyleSheet} from './style';
// import {
//   FlatList,
//   Image,
//   Platform,
//   Pressable,
//   ScrollView,
//   Text,
//   View,
// } from 'react-native';
// import {Header} from '../../components/Header';
// import {CardComponent} from '../../components/CardComponent';
// import {TextComponent} from '../../components/TextComponent';
// import {ButtonComponent} from '../../components/ButtonComponent';
// import {TextInputComponent} from '../../components/TextInputComponent';
// import {ModalComponent} from '../../components/ModalComponent';
// import {useEffect, useRef, useState} from 'react';
// import {Chip} from '../../components/ChipComponent';
// import {interestsCategories} from '../../constants/profile-info-options';
// import AntDesignIcon from 'react-native-vector-icons/dist/AntDesign';
// import {defaultTheme} from '../../config/theme';
// import {useGetUserInfo} from '../../api/profile';
// import DateTimePicker from '@react-native-community/datetimepicker';

// export const ProfileEdit = ({route}) => {
// const styles = createStyleSheet();
// const interestedModalRef = useRef();
// const [formData, setFormData] = useState({});
// const [showDatePicker, setShowDatePicker] = useState(false);

// useEffect(() => {
//   useGetUserInfo().then(res => {
//     console.log('resss', res);
//     setFormData(res?.data?.data);
//   });
// }, []);

//   return (
//     <>
//       <Header />
//       <ScrollView contentContainerStyle={styles.background}>
//         <CardComponent viewStyle={{alignItems: 'center', width: '100%'}}>
//           <TextInputComponent
//             labelStyle={styles.labelStyle}
//             placeholder="Your Phone Number"
//             label="Your Name"
//             numOfLines={1}
//             value={formData?.name}
//           />
//         </CardComponent>
//         <CardComponent viewStyle={{alignItems: 'center', width: '100%'}}>
//           <TextInputComponent
//             labelStyle={styles.labelStyle}
//             placeholder="About me"
//             label="Bio"
//             numOfLines={5}
//             value={formData?.bio}
//           />
//         </CardComponent>
//         <CardComponent viewStyle={{alignItems: 'center', width: '100%'}}>
//           <TextInputComponent
//             labelStyle={styles.labelStyle}
//             placeholder="Your Phone Number"
//             label="Phone Number"
//             numOfLines={1}
//             value={formData?.phone_number}
//             keyboardType="phone-pad"
//           />
//         </CardComponent>
//         <CardComponent>
//           <TextComponent viewStyle={styles.labelStyle}>Birthday</TextComponent>
//           <Chip
//             label={formData?.birthday}
//             onSelect={() => setShowDatePicker(true)}
//           />
//           {showDatePicker && (
//             <DateTimePicker
//               mode="date"
//               value={formData.birthday}
//               display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//               onChange={(event, date) => {
//                 if (date) {
//                   setFormData(prev => ({...prev, birthday: date}));
//                 }
//                 setShowDatePicker(false);
//               }}
//               maximumDate={new Date()}
//             />
//           )}
//         </CardComponent>
//         <CardComponent>
//           <View
//             style={{
//               flexDirection: 'row',
//               alignItems: 'center',
//               justifyContent: 'space-between',
//             }}>
//             <TextComponent viewStyle={styles.labelStyle}>
//               Interests
//             </TextComponent>
//             <Pressable
//               style={{bottom: 4}}
//               onPress={() => interestedModalRef.current.onOpenModal()}>
//               <AntDesignIcon name="edit" size={20} color={defaultTheme.brown} />
//             </Pressable>
//           </View>
//           <View style={{flexWrap: 'wrap', flexDirection: 'row', gap: 8}}>
//             {formData?.passions?.split(',').map(item => (
//               <Chip label={item} />
//             ))}
//           </View>
//         </CardComponent>
//         <CardComponent>
//           <View
//             style={{
//               flexDirection: 'row',
//               alignItems: 'center',
//               justifyContent: 'space-between',
//             }}>
//             <TextComponent viewStyle={styles.labelStyle}>Gender</TextComponent>
//             <Pressable
//               style={{bottom: 4}}
//               onPress={() => interestedModalRef.current.onOpenModal()}>
//               <AntDesignIcon name="edit" size={20} color={defaultTheme.brown} />
//             </Pressable>
//           </View>
//           <View style={{flexWrap: 'wrap', flexDirection: 'row', gap: 8}}>
//             <Chip label={formData?.gender} />
//           </View>
//         </CardComponent>
//         <CardComponent>
//           <View
//             style={{
//               flexDirection: 'row',
//               alignItems: 'center',
//               justifyContent: 'space-between',
//             }}>
//             <TextComponent viewStyle={styles.labelStyle}>
//               Orientation
//             </TextComponent>
//             <Pressable
//               style={{bottom: 4}}
//               onPress={() => interestedModalRef.current.onOpenModal()}>
//               <AntDesignIcon name="edit" size={20} color={defaultTheme.brown} />
//             </Pressable>
//           </View>
//           <View style={{flexWrap: 'wrap', flexDirection: 'row', gap: 8}}>
//             <Chip label={formData?.orientation} />
//           </View>
//         </CardComponent>
//       </ScrollView>
//       {/* <ModalComponent title="Interests" ref={interestedModalRef}>
//         <FlatList
//           contentContainerStyle={{paddingBottom: 16}}
//           data={interestsCategories}
//           renderItem={({item}) => (
//             <View style={{marginTop: 16}}>
//               <Text>Relationship Goals</Text>
//               <View style={styles.chipContainer}>
//                 {item?.list?.map(l => (
//                   <Chip label={l} />
//                 ))}
//               </View>
//             </View>
//           )}
//         />
//         <ButtonComponent buttonText={'Save'} />
//       </ModalComponent> */}
//     </>
//   );
// };

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {LinearGradient} from 'expo-linear-gradient';
import {Header} from '../../components/Header';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useGetUserInfo} from '../../api/profile';
import {TextComponent} from '../../components/TextComponent';
import {createStyleSheet} from './style';
import {TextInputComponent} from '../../components/TextInputComponent';
import {Chip} from '../../components/ChipComponent';
import {hexToRgbA} from '../../utils/hexToRgba';
import {defaultTheme} from '../../config/theme';
import {ButtonComponent} from '../../components/ButtonComponent';

export const ProfileEdit = () => {
  const [name, setName] = useState('Mark Johnson');
  const [email, setEmail] = useState('markjohnson@example.com');
  const [phone, setPhone] = useState('(225) 555-0118');
  const [dob, setDob] = useState('14/02/2023');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [address, setAddress] = useState(
    '1901 Thornridge Cir. Shiloh, Hawaii 81063',
  );

  const [formData, setFormData] = useState({});

  const style = createStyleSheet();

  useEffect(() => {
    useGetUserInfo().then(res => {
      console.log('resss', res);
      setFormData(res?.data?.data);
    });
  }, []);

  return (
    <>
      <Header />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{paddingBottom: 40}}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{uri: 'https://randomuser.me/api/portraits/men/32.jpg'}}
              style={styles.avatar}
            />
            <Pressable style={styles.editIcon}>
              <Icon name="create" size={14} color="#fff" />
            </Pressable>
          </View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>

        <View style={styles.form}>
          <View>
            <TextInputComponent
              labelStyle={style.labelStyle}
              placeholder="Your Name"
              label="Name"
              numOfLines={1}
              value={formData?.name}
              keyboardType="phone-pad"
            />
          </View>
          <View>
            <TextInputComponent
              labelStyle={style.labelStyle}
              placeholder="Your Phone Number"
              label="Phone Number"
              numOfLines={1}
              value={formData?.phone_number}
              keyboardType="phone-pad"
            />
          </View>
          <View>
            <TextInputComponent
              labelStyle={style.labelStyle}
              placeholder="About me"
              label="Bio"
              numOfLines={5}
              value={formData?.bio}
            />
          </View>
          <View>
            <TextComponent viewStyle={style.labelStyle}>Birthday</TextComponent>
            <Chip
              label={formData?.birthday}
              onSelect={() => setShowDatePicker(true)}
              chipStyle={{
                paddingTop: 12,
                paddingBottom: 4,
                borderColor: hexToRgbA(defaultTheme.brown, 0.3),
              }}
              labelStyle={style.labelStyle}
            />
          </View>
          {showDatePicker && (
            <DateTimePicker
              mode="date"
              value={new Date(formData.birthday)}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, date) => {
                if (date) {
                  setFormData(prev => ({...prev, birthday: date}));
                }
                setShowDatePicker(false);
              }}
              maximumDate={new Date()}
            />
          )}
        </View>
        {showDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                const formatted = selectedDate.toLocaleDateString('en-GB');
                setDob(formatted); // e.g. 14/02/2023
              }
            }}
          />
        )}
      </ScrollView>
      <ButtonComponent
        buttonText={'Update'}
        viewStyle={{position: 'absolute', bottom: 16, left: 16, right: 16}}
      />
    </>
  );
};

// const FormField = ({label, value, onChangeText, iconRight, onPress}) => (
//   <View style={styles.inputGroup}>
//     <Text style={styles.label}>{label}</Text>
//     <Pressable onPress={onPress} style={styles.inputWrapper}>
//       <TextInput
//         value={value}
//         editable={!onPress}
//         onChangeText={onChangeText}
//         style={styles.input}
//         placeholder={label}
//         placeholderTextColor="#aaa"
//         pointerEvents={onPress ? 'none' : 'auto'}
//       />
//       {iconRight && <View style={styles.iconRight}>{iconRight}</View>}
//     </Pressable>
//   </View>
// );
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginBottom: 42,
  },
  backButton: {
    margin: 16,
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    height: 80,
    width: 80,
    borderRadius: 40,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: -4,
    backgroundColor: '#f74a6e',
    borderRadius: 12,
    padding: 4,
  },
  name: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  email: {
    color: '#999',
    fontSize: 14,
  },
  form: {
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: '#f74a6e',
    marginBottom: 4,
    fontSize: 13,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#f74a6e',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#000',
  },
  iconRight: {
    position: 'absolute',
    right: 14,
    top: '50%',
    transform: [{translateY: -9}],
  },
  saveButton: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
  },
  saveContent: {
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
