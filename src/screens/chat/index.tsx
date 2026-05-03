import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  useAddChatsBetweenUsers,
  useGetChatsBetweenUsers,
} from "../../api/chat";
import { useMatchedUserIds } from "../../api/match";
import { Header } from "../../components/Header";
import { defaultTheme } from "../../config/theme";
import { hexToRgbA } from "../../utils/hexToRgba";
import socket, { connectSocketWithAuth } from "../../utils/socket";
import { createStyleSheet } from "./style";

type ChatIds = {
  user_id?: string;
  other_user_id?: string;
};

type ChatMessage = {
  id: string;
  text: string;
  time: string;
  sender: "me" | "other";
  senderId?: string;
  recieverId?: string;
  user_id?: string;
  other_user_id?: string;
  message?: string;
  created_at?: string;
};

const resolveMessageText = (message: ChatMessage) => {
  return message.text || message.message || "";
};

const resolveMessageTime = (message: ChatMessage) => {
  if (message.time) {
    return message.time;
  }

  if (message.created_at) {
    const createdAt = new Date(message.created_at);
    if (!Number.isNaN(createdAt.getTime())) {
      return createdAt.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  }

  return "";
};

const normalizeChatMessage = (
  message: Partial<ChatMessage>,
  currentUserId?: string,
): ChatMessage => {
  const senderId = String(message.senderId || message.user_id || "").trim();
  const resolvedSender =
    message.sender ||
    (currentUserId && senderId === currentUserId ? "me" : "other");

  return {
    id: String(
      message.id ||
        message.created_at ||
        `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ),
    text: resolveMessageText(message as ChatMessage),
    time: resolveMessageTime(message as ChatMessage),
    sender: resolvedSender === "me" ? "me" : "other",
    senderId,
    recieverId: message.recieverId,
    user_id: message.user_id,
    other_user_id: message.other_user_id,
    created_at: message.created_at,
    message: message.message,
  };
};

export const Chat = () => {
  const navigation = useNavigation();
  const styles = createStyleSheet();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [ids, setIds] = useState<ChatIds>();
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const flatListRef = useRef<FlatList<ChatMessage>>(null);

  useEffect(() => {
    let isMounted = true;
    let joinedRoomIds: { userId?: string; otherUserId?: string } | null = null;

    const handleConnectError = (err: { message?: string }) => {
      console.log(err?.message || "Socket connect error");
    };

    const handleReceiveMessage = (msg: Partial<ChatMessage>) => {
      if (msg?.senderId === joinedRoomIds?.userId) {
        return;
      }

      const normalizedMessage = normalizeChatMessage(
        msg,
        joinedRoomIds?.userId,
      );
      setMessages((prev) => [...prev, normalizedMessage]);
      flatListRef.current?.scrollToEnd({ animated: true });
    };

    const initChat = async () => {
      setIsLoading(true);
      setLoadError("");

      socket.on("connect_error", handleConnectError);
      await connectSocketWithAuth();

      const res = await useMatchedUserIds();
      if (!isMounted) {
        return;
      }

      const currentIds = (res?.data || {}) as ChatIds;
      setIds(currentIds);
      joinedRoomIds = {
        userId: currentIds?.user_id,
        otherUserId: currentIds?.other_user_id,
      };

      const chats = await useGetChatsBetweenUsers({
        otherUserId: currentIds?.other_user_id,
      });
      if (!isMounted) {
        return;
      }

      const normalizedMessages = Array.isArray(chats?.data)
        ? chats.data.map((message: Partial<ChatMessage>) =>
            normalizeChatMessage(message, currentIds?.user_id),
          )
        : [];

      setMessages(normalizedMessages);

      socket.emit("joinRoom", {
        userId: currentIds?.user_id,
        otherUserId: currentIds?.other_user_id,
      });
      socket.on("receiveMessage", handleReceiveMessage);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 100);
    };

    initChat()
      .catch((error) => {
        console.log("chat init error", error);
        if (isMounted) {
          setLoadError("Could not load your chat right now.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
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

  const sendMessage = async () => {
    if (!input.trim() || !ids?.other_user_id || isSending) {
      return;
    }

    const draftMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      sender: "me",
      senderId: ids?.user_id,
      recieverId: ids?.other_user_id,
    };

    try {
      setIsSending(true);
      await useAddChatsBetweenUsers({
        toId: ids?.other_user_id,
        message: draftMessage.text,
      });

      socket.emit("sendMessage", draftMessage);
      setMessages((prev) => [...prev, draftMessage]);
      setInput("");

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } finally {
      setIsSending(false);
    }
  };

  const renderItem = ({ item }: { item: ChatMessage }) => {
    const isMe = item.sender === "me";

    return (
      <View
        style={[
          styles.messageRow,
          isMe ? styles.messageRowMe : styles.messageRowOther,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isMe ? styles.myMessage : styles.theirMessage,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isMe ? styles.myMessageText : styles.theirMessageText,
            ]}
          >
            {item.text}
          </Text>
          <Text
            style={[
              styles.timeText,
              isMe ? styles.myTimeText : styles.theirTimeText,
            ]}
          >
            {item.time}
          </Text>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View style={styles.stateWrap}>
          <View style={styles.stateBadge}>
            <ActivityIndicator size="small" color={defaultTheme.primary} />
          </View>
          <Text style={styles.stateTitle}>Loading chat...</Text>
          <Text style={styles.stateSubtitle}>
            Pulling in your conversation now.
          </Text>
        </View>
      );
    }

    if (loadError) {
      return (
        <View style={styles.stateWrap}>
          <View style={styles.stateBadge}>
            <Ionicons
              name="alert-circle-outline"
              size={22}
              color={defaultTheme.primary}
            />
          </View>
          <Text style={styles.stateTitle}>Chat unavailable</Text>
          <Text style={styles.stateSubtitle}>{loadError}</Text>
        </View>
      );
    }

    return (
      <View style={styles.stateWrap}>
        <View style={styles.stateBadge}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={22}
            color={defaultTheme.primary}
          />
        </View>
        <Text style={styles.stateTitle}>Start your first message</Text>
        <Text style={styles.stateSubtitle}>
          Keep it simple. Something real always lands better.
        </Text>
      </View>
    );
  };

  return (
    <>
      <Header
        prefixTitle="Private Chat"
        title="OnlyOne"
        showBack
        onBackPress={() => (navigation as any).goBack()}
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={80}
      >
        <View style={styles.topBanner}>
          <View style={styles.topBannerDot} />
          <Text style={styles.topBannerText}>
            One real connection. Keep the convo intentional.
          </Text>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.messagesContainer,
            messages.length === 0 ? styles.messagesContainerEmpty : null,
          ]}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.composerShell}>
          <View style={styles.composerCard}>
            <TextInput
              style={styles.input}
              placeholder="Write something worth replying to..."
              placeholderTextColor={hexToRgbA(defaultTheme.primary, 40)}
              value={input}
              onChangeText={setInput}
              multiline
              maxLength={400}
              textAlignVertical="top"
            />
            <Pressable
              onPress={sendMessage}
              disabled={!input.trim() || isSending}
              style={[
                styles.sendButton,
                !input.trim() || isSending ? styles.sendButtonDisabled : null,
              ]}
            >
              <Ionicons
                name="arrow-up"
                size={18}
                color={!input.trim() || isSending ? "#8b8b92" : "#ffffff"}
              />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};
