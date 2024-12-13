import { Image, ScrollView, Text, View, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";
import { WebView } from "react-native-webview";

import { images } from "@/constants";

const Chat = () => {
  // Botpress webchat configuration
  const botpressConfig = {
    composerPlaceholder: "Chat with me!",
    botConversationDescription: "This is a demo chat",
    botId: "TP8JRN9L", // Your bot ID from the script URL
    hostUrl: "https://cdn.botpress.cloud/webchat/v2.2",
    messagingUrl: "https://messaging.botpress.cloud",
    clientId: "TP8JRN9L", // Replace with your actual client ID
  };

  // Create WebView HTML content
  const webviewContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body>
        <div id="webchat"></div>
        <script src="https://cdn.botpress.cloud/webchat/v2.2/inject.js"></script>
        <script>
          window.botpressWebChat.init(${JSON.stringify(botpressConfig)});
        </script>
      </body>
    </html>
  `;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Text className="text-2xl font-JakartaBold p-5">Chat</Text>
      <View className="flex-1">
        <WebView
          source={{ html: webviewContent }}
          style={{ flex: 1 }}
          onNavigationStateChange={(event) => {
            // Handle external links
            if (event.url !== 'about:blank') {
              Linking.openURL(event.url);
              return true;
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Chat;
