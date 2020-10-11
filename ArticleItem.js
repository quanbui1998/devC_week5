import React from 'react';
import { StyleSheet, Text, View, Image, Linking } from 'react-native';
import { Card, Button } from 'react-native-elements';

var dayjs = require('dayjs');
var relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

export default function ArticleItem({ articleItem }) {
  return (
    <Card containerStyle={styles.container}>
      <Card.Title>{articleItem.title}</Card.Title>
      <Image
        source={{ uri: articleItem.urlToImage }}
        style={{ width: '100%', height: undefined, aspectRatio: 16 / 9 }}
      />
      <View style={styles.content}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.label}>Source</Text>
          <Text style={styles.textGray}>{articleItem.source?.name}</Text>
        </View>
        <Text style={styles.textContent}>{articleItem.content}</Text>
        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
          <Text style={styles.label}>Pushlised</Text>
          <Text style={styles.textGray}>
            {dayjs(articleItem.publishedAt).fromNow()}
          </Text>
        </View>
        <Button
          title='Read more'
          onPress={() => {
            Linking.canOpenURL(articleItem.url).then((supported) => {
              if (supported) {
                Linking.openURL(articleItem.url);
              } else {
                console.log(`Don't know how to open URL: ${articleItem.url}`);
              }
            });
          }}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
  },
  content: {
    padding: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  textGray: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'gray',
  },
  textContent: {
    fontSize: 14,
  },
});
