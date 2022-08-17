import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";

import { useEffect, useState } from "react";
import { Text } from "react-native";
import { StreamChat } from "stream-chat";
import {
  Channel,
  ChannelList,
  Chat,
  MessageInput,
  MessageList,
  OverlayProvider,
} from "stream-chat-expo";

const API_KEY = "drudkatcayvd";
const client = StreamChat.getInstance(API_KEY);

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const [isReady, setIsReady] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<any>(null);

  useEffect(() => {
    // connect the user only once within the app instance
    const connectUser = async () => {
      await client.connectUser(
        {
          id: "juleni",
          name: "Je eL",
          image: "https://i.imgur.com/fR9Jz14.png",
        },
        client.devToken("juleni") // generate temporary dev. token
        // in prod it should be authentication token (eg. from db)
      );
      console.log("User connected");

      // create a channel
      const channel = client.channel("messaging", "JeeL3", {
        name: "JeeLsChannel3",
      });

      await channel.watch(); // creates and updates channel
      setIsReady(true);
    };

    connectUser();

    // disconnect user on close (unmount)
    return () => client.disconnectUser();
  }, []);

  const onChannelPressed = (channel: any) => {
    console.log("channel pressed: " + channel);
    setSelectedChannel(channel);
  };

  if (!isLoadingComplete || !isReady) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <OverlayProvider>
          <Chat client={client}>
            {selectedChannel ? (
              <Channel channel={selectedChannel}>
                <MessageList />
                <MessageInput />
                <Text
                  style={{ margin: 50 }}
                  onPress={() => setSelectedChannel(null)}
                >
                  Go back
                </Text>
              </Channel>
            ) : (
              <Text style={{ margin: 50 }}>
                {" "}
                ***
                <ChannelList
                  onSelect={(channel) =>
                    console.log("channel pressed: " + channel)
                  }
                />
              </Text>
            )}
          </Chat>
        </OverlayProvider>
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}
