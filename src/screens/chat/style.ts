import {StyleSheet} from 'react-native';

export const createStyleSheet = () => {
  const bubbleBase = {
    maxWidth: '75%',
    borderRadius: 16,
    padding: 12,
    marginVertical: 4,
  };

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    messagesContainer: {
      padding: 16,
      paddingBottom: 40,
    },
    messageBubble: {
      ...bubbleBase,
    },
    myMessage: {
      backgroundColor: '#e6a9a9',
      alignSelf: 'flex-end',
      borderTopRightRadius: 0,
    },
    theirMessage: {
      backgroundColor: '#f1f1f1',
      alignSelf: 'flex-start',
      borderTopLeftRadius: 0,
    },
    messageText: {
      fontSize: 15,
      color: '#333',
    },
    timeText: {
      fontSize: 10,
      color: '#555',
      textAlign: 'right',
      marginTop: 4,
    },
    inputContainer: {
      flexDirection: 'row',
      borderTopWidth: 1,
      borderTopColor: '#ddd',
      padding: 10,
      alignItems: 'center',
      backgroundColor: '#fff',
    },
    input: {
      flex: 1,
      padding: 10,
      backgroundColor: '#f2f2f2',
      borderRadius: 20,
      marginRight: 10,
    },
    sendButton: {
      fontSize: 22,
    },
  });
};
