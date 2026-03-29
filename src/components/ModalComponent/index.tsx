import {Pressable, Text, View} from 'react-native';
import {createStyleSheet} from './style';
import ReactNativeModal from 'react-native-modal';
import {ReactNode, Ref, forwardRef, useImperativeHandle, useState} from 'react';
import EntypoIcon from 'react-native-vector-icons/dist/Entypo';
import {defaultTheme} from '../../config/theme';

interface ModalProps {
  children: ReactNode;
  title?: string;
}

const modalComponent = ({children, title}: ModalProps, ref: Ref<any>) => {
  const styles = createStyleSheet();
  const [visble, setVisible] = useState(false);

  useImperativeHandle(ref, () => ({
    onOpenModal() {
      setVisible(true);
    },
    onCloseModal() {
      setVisible(false);
    },
  }));

  return (
    <View>
      <ReactNativeModal
        onBackButtonPress={() => setVisible(false)}
        isVisible={visble}>
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            <Pressable onPress={() => setVisible(false)}>
              <EntypoIcon name="cross" size={30} color={defaultTheme.brown} />
            </Pressable>
          </View>
          {children}
        </View>
      </ReactNativeModal>
    </View>
  );
};

export const ModalComponent = forwardRef(modalComponent);
