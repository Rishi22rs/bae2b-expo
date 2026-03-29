// import React from 'react';
// import {View, Text, Image, Pressable} from 'react-native';
// import {Header} from '../../components/Header';
// import {createStyleSheet} from './style';
// import {useNavigation} from '@react-navigation/native';
// import {navigationConstants} from '../../constants/app-navigation';

// export const ItsAMatch = () => {
//   const styles = createStyleSheet();
//   const navigation = useNavigation();

//   const handleChatNavigation = () => {
//     navigation.navigate(navigationConstants.MATCH_ROUTE, {
//       screen: navigationConstants.CHAT,
//       params: {},
//     });
//   };

// const handleProfileNavigation = () => {
//   navigation.navigate(navigationConstants.MATCH_ROUTE, {
//     screen: navigationConstants.VIEW_ONLY_PROFILE,
//   });
// };

//   return (
//     <>
//       <Header />
//       <View style={styles.container}>
//         <Text style={styles.matchText}>It's a Match!</Text>

//         <View style={styles.imageContainer}>
//           <Image
//             source={{uri: 'https://via.placeholder.com/100'}}
//             style={styles.profileImage}
//           />
//           <Image
//             source={{uri: 'https://via.placeholder.com/100'}}
//             style={styles.profileImage}
//           />
//         </View>

//         {/* <Text style={styles.termsText}>
//           By tapping, you agree to our{' '}
//           <Text style={styles.link}>Terms and Privacy Policy</Text>
//         </Text> */}

//         <View style={styles.buttonContainer}>
//           <Pressable
//             style={[styles.button, styles.fbButton]}
//             onPress={handleProfileNavigation}>
//             <Text style={styles.fbText}>View Profile</Text>
//           </Pressable>
//           <Pressable
//             style={[styles.button, styles.googleButton]}
//             onPress={handleChatNavigation}>
//             <Text style={styles.googleText}>Chat</Text>
//           </Pressable>
//         </View>

//         {/* <Text style={styles.footerText}>
//           We don't post anything to Facebook.
//         </Text> */}
//       </View>
//     </>
//   );
// };

import React from 'react';
import {View, Text, Image, Dimensions, Pressable} from 'react-native';
import {createStyleSheet} from './style';
import {Header} from '../../components/Header';
import {ButtonComponent} from '../../components/ButtonComponent';
import {useNavigation} from '@react-navigation/native';
import {navigationConstants} from '../../constants/app-navigation';
import {unmatch} from '../../api/match';

const {width} = Dimensions.get('window');

export const ItsAMatch = () => {
  const styles = createStyleSheet();
  const navigation = useNavigation();

  const handleProfileNavigation = () => {
    navigation.navigate(navigationConstants.MATCH_ROUTE, {
      screen: navigationConstants.VIEW_ONLY_PROFILE,
    });
  };

  const handleChatNavigation = () => {
    navigation.navigate(navigationConstants.MATCH_ROUTE, {
      screen: navigationConstants.CHAT,
      params: {},
    });
  };

  const handleUnmatch = () => {
    unmatch().then(res => {
      navigation.navigate(navigationConstants.BOTTOM_TABS, {
        screen: navigationConstants.HOME_ROUTE,
        params: {},
      });
    });
  };

  return (
    <>
      <Header prefixTitle="Match" />
      <View style={styles.container}>
        <View style={styles.cardContainer}>
          <Image
            source={{uri: 'https://i.imgur.com/Oj1iX1u.jpg'}} // Female image
            style={[styles.cardImage, {transform: [{rotate: '-10deg'}]}]}
          />
          <Image
            source={{uri: 'https://i.imgur.com/axPzH3N.jpg'}} // Male image
            style={[styles.cardImage, {transform: [{rotate: '10deg'}]}]}
          />
        </View>

        <Text style={styles.title}>Congratulations</Text>
        <Text style={styles.subtitle}>It’s a Match</Text>
        <Text style={styles.description}>
          Start conversation now to each other
        </Text>
        <Pressable
          style={styles.keepSwipingButton}
          onPress={handleProfileNavigation}>
          <Text style={styles.keepSwipingText}>Profile</Text>
        </Pressable>
        <ButtonComponent
          onPress={handleChatNavigation}
          viewStyle={{width: '100%'}}
          buttonText={'Say Hello'}
        />
        <ButtonComponent
          onPress={handleUnmatch}
          viewStyle={{width: '100%'}}
          buttonText={'Un-Match'}
        />
      </View>
    </>
  );
};
