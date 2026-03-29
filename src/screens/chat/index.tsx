import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Header} from '../../components/Header';
import {createStyleSheet} from './style';
import socket from '../../utils/socket';
import {useMatchedUserIds} from '../../api/match';
import {useAddChatsBetweenUsers, useGetChatsBetweenUsers} from '../../api/chat';

// const mockMessages = [
//   {
//     id: '1',
//     text: 'Hey! Do you want to meet up this week?',
//     time: '20:45',
//     sender: 'other',
//     senderId: 'dkfn',
//   },
// ];

export const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [ids, setIds] = useState();
  const flatListRef = useRef<FlatList>(null);
  const styles = createStyleSheet();

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({animated: false});
    }, 100);
    useMatchedUserIds().then(res => {
      setIds(res?.data);
      useGetChatsBetweenUsers({
        otherUserId: res?.data?.other_user_id,
      }).then(chats => {
        setMessages(chats?.data);
        socket.emit('joinRoom', {
          userId: res?.data?.user_id,
          otherUserId: res?.data?.other_user_id,
        });

        socket.on('receiveMessage', msg => {
          if (msg?.senderId === res?.data?.user_id) return;
          setMessages(prev => [...prev, {...msg, sender: 'other'}]);
          flatListRef.current?.scrollToEnd({animated: true});
        });

        return () => {
          socket.emit('leaveRoom', {
            userId: res?.data?.user_id,
            otherUserId: res?.data?.other_user_id,
          });
          socket.off('receiveMessage');
        };
      });
    });
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      text: input,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      sender: 'me',
      senderId: ids?.user_id,
      recieverId: ids?.other_user_id,
    };

    useAddChatsBetweenUsers({
      toId: ids?.other_user_id,
      message: input,
    }).then(() => {
      socket.emit('sendMessage', newMessage);
      setMessages(prev => {
        const updated = [...prev, newMessage];

        setTimeout(() => {
          flatListRef.current?.scrollToEnd({animated: true});
        }, 100);

        return updated;
      });
    });

    setInput('');
  };

  const renderItem = ({item}) => {
    const isMe = item.sender === 'me';
    return (
      <View
        style={[
          styles.messageBubble,
          isMe ? styles.myMessage : styles.theirMessage,
        ]}>
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>
    );
  };

  return (
    <>
      <Header />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messagesContainer}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({animated: true})
          }
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            value={input}
            onChangeText={setInput}
          />
          <TouchableOpacity onPress={sendMessage}>
            <Text style={styles.sendButton}>📨</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};
