import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  useAddChatsBetweenUsers,
  useGetChatsBetweenUsers,
} from "../../api/chat";
import { useMatchedUserIds } from "../../api/match";
import { Header } from "../../components/Header";
import socket, { connectSocketWithAuth } from "../../utils/socket";
import { createStyleSheet } from "./style";

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
  const [input, setInput] = useState("");
  const [ids, setIds] = useState();
  const flatListRef = useRef<FlatList>(null);
  const styles = createStyleSheet();

  useEffect(() => {
    let isMounted = true;
    let joinedRoomIds: { userId?: string; otherUserId?: string } | null = null;

    const handleConnectError = (err: { message?: string }) => {
      console.log(err?.message || "Socket connect error");
    };

    const handleReceiveMessage = (msg) => {
      if (msg?.senderId === joinedRoomIds?.userId) return;
      setMessages((prev) => [...prev, { ...msg, sender: "other" }]);
      flatListRef.current?.scrollToEnd({ animated: true });
    };

    const initChat = async () => {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 100);

      socket.on("connect_error", handleConnectError);
      await connectSocketWithAuth();

      const res = await useMatchedUserIds();
      if (!isMounted) return;

      const currentIds = res?.data;
      setIds(currentIds);
      joinedRoomIds = {
        userId: currentIds?.user_id,
        otherUserId: currentIds?.other_user_id,
      };

      const chats = await useGetChatsBetweenUsers({
        otherUserId: currentIds?.other_user_id,
      });
      if (!isMounted) return;

      setMessages(chats?.data);

      socket.emit("joinRoom", {
        userId: currentIds?.user_id,
        otherUserId: currentIds?.other_user_id,
      });
      socket.on("receiveMessage", handleReceiveMessage);
    };

    initChat().catch((error) => {
      console.log("chat init error", error);
    });

    return () => {
      isMounted = false;
      socket.off("connect_error", handleConnectError);
      socket.off("receiveMessage", handleReceiveMessage);

      if (joinedRoomIds?.userId && joinedRoomIds?.otherUserId) {
        socket.emit("leaveRoom", {
          userId: joinedRoomIds.userId,
          otherUserId: joinedRoomIds.otherUserId,
        });
      }
    };
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      text: input,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      sender: "me",
      senderId: ids?.user_id,
      recieverId: ids?.other_user_id,
    };

    useAddChatsBetweenUsers({
      toId: ids?.other_user_id,
      message: input,
    }).then(() => {
      socket.emit("sendMessage", newMessage);
      setMessages((prev) => {
        const updated = [...prev, newMessage];

        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);

        return updated;
      });
    });

    setInput("");
  };

  const renderItem = ({ item }) => {
    const isMe = item.sender === "me";
    return (
      <View
        style={[
          styles.messageBubble,
          isMe ? styles.myMessage : styles.theirMessage,
        ]}
      >
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
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={80}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesContainer}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
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
