import { useNavigation } from "@react-navigation/native";
import { useEffect, useRef } from "react";
import { Text } from "react-native";
import { useCurrentStep } from "../../api/auth";
import { navigationConstants } from "../../constants/app-navigation";

export const Stepper = () => {
  const navigation = useNavigation<any>();
  const hasResolvedStepRef = useRef(false);

  useEffect(() => {
    if (hasResolvedStepRef.current) {
      return;
    }

    hasResolvedStepRef.current = true;

    let isMounted = true;

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
      .then((res) => {
        if (!isMounted) {
          return;
        }

        navigation.replace(res?.data?.routeName, {
          screen: res?.data?.route,
          params: {},
        });
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        navigation.replace(navigationConstants.LOGIN_ROUTE, {
          screen: navigationConstants.LOGIN,
          params: {},
        });
      });

    return () => {
      isMounted = false;
    };
  }, [navigation]);
  return <Text>Stepper</Text>;
};
