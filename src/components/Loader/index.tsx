import React, {useEffect, useRef} from 'react';
import {View, Animated} from 'react-native';
import {createStyleSheet} from './style';

interface LoaderProps {
  visible?: boolean;
}

const Loader = ({visible = true}: LoaderProps) => {
  const styles = createStyleSheet();
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <>
      {visible ? (
        <View style={styles.container}>
          <Animated.View
            style={[
              styles.circle,
              {
                transform: [
                  {
                    scale: scaleAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1.5],
                    }),
                  },
                ],
                opacity: scaleAnim,
              },
            ]}
          />
        </View>
      ) : (
        <></>
      )}
    </>
  );
};

export default Loader;
