import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

const YjsConnectionExample: React.FC = () => {
  const [text, setText] = useState('');
  const [ytext, setYText] = useState<Y.Text | null>(null);

  useEffect(() => {
    const ydoc = new Y.Doc();
    const wsProvider = new WebsocketProvider('wss://your-websocket-server.com', 'your-room-name', ydoc);

    const localYText = ydoc.getText('shared-text');
    setYText(localYText);

    wsProvider.on('status', (event: any) => {
      console.log(event.status);
    });

    localYText.observe((event) => {
      setText(localYText.toString());
    });

    return () => {
      wsProvider.disconnect();
      ydoc.destroy();
    };
  }, []);

  const handleTextChange = (newText: string) => {
    setText(newText);
    if (ytext) {
      ytext.delete(0, ytext.length);
      ytext.insert(0, newText);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Type something:</Text>
      <TextInput
        style={styles.textInput}
        value={text}
        onChangeText={handleTextChange}
        autoCorrect={false}
        multiline
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'gray',
    width: '80%',
    marginTop: 10,
    padding: 10,
    textAlignVertical: 'top',
  },
});

export default YjsConnectionExample;
