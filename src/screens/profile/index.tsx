// import {useNavigation} from '@react-navigation/native';
// import {Image, ScrollView} from 'react-native';
// import {ButtonComponent} from '../../components/ButtonComponent';
// import {CardComponent} from '../../components/CardComponent';
// import {Header} from '../../components/Header';
// import {navigationConstants} from '../../constants/app-navigation';
// import {createStyleSheet} from './style';
// import {useLogout} from '../../utils/useLogout';

// export const Profile = async ({route}) => {
//   const styles = createStyleSheet();
//   const navigation = useNavigation();
//   // const logout = await useLogout();

//   const handleEditProfile = () => {
//     navigation.navigate(navigationConstants.PROFILE_ROUTE, {
//       screen: navigationConstants.PROFILE_EDIT,
//       params: {},
//     });
//   };

//   return (
//     <>
//       <Header />
//       <ScrollView contentContainerStyle={styles.background}>
//         <CardComponent>
//           <Image
//             source={{
//               uri:
//                 'https://rukminim2.flixcart.com/image/850/1000/xif0q/poster/s/d/v/medium-anime-girls-fantasy-anime-girls-hd-matte-finish-poster-original-imagh8k9taqepyzs.jpeg?q=90&crop=false' ||
//                 undefined,
//             }}
//             style={styles.profileImage}
//           />
//           <ButtonComponent
//             buttonText="Edit"
//             viewStyle={styles.cta}
//             onPress={handleEditProfile}
//           />
//         </CardComponent>
//         <ButtonComponent
//           buttonText="Logout"
//           viewStyle={styles.cta}
//           onPress={logout}
//         />
//       </ScrollView>
//     </>
//   );
// };

import { screenWidth } from "@/utils/dimensions";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import Animated, { SlideInDown } from "react-native-reanimated";
import Icon from "react-native-vector-icons/Ionicons";
import { ButtonComponent } from "../../components/ButtonComponent";
import { Header } from "../../components/Header";
import { navigationConstants } from "../../constants/app-navigation";
import { logout } from "../../utils/useLogout";
import { createStyleSheet } from "./style";

export const Profile = () => {
  const styles = createStyleSheet();
  const navigation = useNavigation();

  const handleEditProfile = () => {
    navigation.navigate(navigationConstants.PROFILE_ROUTE, {
      screen: navigationConstants.PROFILE_EDIT,
      params: {},
    });
  };

  const profileOptions = [
    { label: "Settings", icon: "settings-outline" },
    { label: "Terms & Conditions", icon: "globe-outline" },
    { label: "Privacy Policy", icon: "notifications-outline" },
    { label: "About Us", icon: "eye-outline" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header prefixTitle="Profile" />

      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: "https://randomuser.me/api/portraits/men/32.jpg",
            }}
            style={styles.avatar}
          />
          <Pressable style={styles.editIcon} onPress={handleEditProfile}>
            <Icon name="create" size={14} color="#fff" />
          </Pressable>
        </View>
        <Text style={styles.name}>Mark Johnson</Text>
        <Text style={styles.email}>markjohnson@example.com</Text>
      </View>

      <FlatList
        data={profileOptions}
        keyExtractor={(item) => item.label}
        contentContainerStyle={styles.optionsContainer}
        renderItem={({ item, index }) => (
          <Animated.View entering={SlideInDown.duration(200 + 100 * index)}>
            <Pressable onPress={item?.onPress} style={styles.optionRow}>
              <View style={styles.optionLeft}>
                <Icon name={item.icon} size={20} color="#000" />
                <Text style={styles.optionLabel}>{item.label}</Text>
              </View>
              <Icon name="chevron-forward" size={20} color="#000" />
            </Pressable>
          </Animated.View>
        )}
      />

      {/* <LinearGradient
        colors={['#f96163', '#f74a6e']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.logoutButton}>
        <Pressable style={styles.logoutContent} onPress={() => {}}>
          <Icon name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </LinearGradient> */}
      <ButtonComponent
        buttonText={"Logout"}
        showIcon
        onPress={() => logout(navigation)}
        viewStyle={{
          marginBottom: 16,
          width: screenWidth - 32,
          marginLeft: 16,
        }}
      />
    </SafeAreaView>
  );
};
