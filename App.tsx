import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";

import { useEffect } from "react";
import { StreamChat } from "stream-chat";

const API_KEY = "drudkatcayvd";
const client = StreamChat.getInstance(API_KEY);

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

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
      const channel = client.channel("messaging", "JeeL", {
        name: "JeeLsChannel",
      });

      await channel.watch(); // creates and updates channel
    };

    connectUser();

    // disconnect user on close (unmount)
    return () => client.disconnectUser();
  }, []);

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}
