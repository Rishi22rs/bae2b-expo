import {useEffect} from 'react';
import {Alert, Text} from 'react-native';
import {useCurrentStep} from '../../api/auth';
import {useNavigation} from '@react-navigation/native';
import {navigationConstants} from '../../constants/app-navigation';
import {useGetAlerts, useMarkAlertAsRead} from '../../api/app';

export const Stepper = () => {
  const navigation = useNavigation();
  useEffect(() => {
    // useGetAlerts().then(res => {
    //   !!res?.data?.length
    //     ? Alert.alert(
    //         res?.data?.[0]?.alert_title,
    //         res?.data?.[0]?.alert_description,
    //         [
    //           {
    //             text: res?.data?.[0]?.alert_cta_text,
    //             onPress: () => {
    //               useMarkAlertAsRead().then(() => {
    //                 useCurrentStep()
    //                   .then(res => {
    //                     navigation.replace(res?.data?.routeName, {
    //                       screen: res?.data?.route,
    //                       params: {},
    //                     });
    //                   })
    //                   .catch(() =>
    //                     navigation.replace(navigationConstants.LOGIN_ROUTE, {
    //                       screen: navigationConstants.LOGIN,
    //                       params: {},
    //                     }),
    //                   );
    //               });
    //             },
    //             style: 'cancel',
    //           },
    //         ],
    //       )
    //     : useCurrentStep()
    //         .then(res => {
    //           navigation.replace(res?.data?.routeName, {
    //             screen: res?.data?.route,
    //             params: {},
    //           });
    //         })
    //         .catch(() =>
    //           navigation.replace(navigationConstants.LOGIN_ROUTE, {
    //             screen: navigationConstants.LOGIN,
    //             params: {},
    //           }),
    //         );
    // });
    useCurrentStep()
      .then(res => {
        navigation.replace(res?.data?.routeName, {
          screen: res?.data?.route,
          params: {},
        });
      })
      .catch(() =>
        navigation.replace(navigationConstants.LOGIN_ROUTE, {
          screen: navigationConstants.LOGIN,
          params: {},
        }),
      );
  }, []);
  return <Text>Stepper</Text>;
};
