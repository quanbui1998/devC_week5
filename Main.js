import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ArticleItem from './ArticleItem';
import { SearchBar } from 'react-native-elements';

const API_KEY = '661637cda8044cebab098acd41d6dae4';
let currentPage = 1;
let isOutOfArticle = false;

export default function Main() {
  const [loading, setLoading] = useState(false);

  const [listArticles, setListArticles] = useState([]);

  const [search, setSearch] = useState('');

  useEffect(() => {
    getArticles();
  }, []);

  function getArticles() {
    if (loading || isOutOfArticle) return;
    setLoading(true);
    fetch(
      `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}&page=${currentPage}&q=${search}`
    )
      .then((response) => {
        response.json().then((responseJson) => {
          if (responseJson.status === 'ok' && responseJson.articles) {
            if (responseJson.articles.length !== 0) {
              currentPage++;
              let lastId = -1;
              if (listArticles.length !== 0) {
                lastId = listArticles[listArticles.length - 1].id;
              }
              for (let i = 0; i < responseJson.articles.length; i++) {
                responseJson.articles[i].id = ++lastId;
                listArticles.push(responseJson.articles[i]);
              }
              setListArticles([...listArticles]);
            } else {
              isOutOfArticle = true;
              const mess =
                listArticles.length === 0
                  ? 'There are no relevant articles'
                  : 'Out of articles';
              Alert.alert(
                'Notification',
                mess,
                [{ text: 'OK', onPress: () => {} }],
                { cancelable: true }
              );
            }
          } else {
            Alert.alert(
              'Error',
              responseJson.message || 'Some thing error!',
              [{ text: 'OK', onPress: () => {} }],
              { cancelable: true }
            );
          }
        });
      })
      .catch(() => {
        Alert.alert(
          'Error',
          'Some thing error!',
          [{ text: 'OK', onPress: () => {} }],
          { cancelable: true }
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function onSearch() {
    isOutOfArticle = false;
    listArticles.splice(0, listArticles.length);
    currentPage = 1;
    getArticles();
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <View style={styles.body}>
          <SearchBar
            placeholder='Type here...'
            onChangeText={setSearch}
            platform='android'
            value={search}
            containerStyle={{
              paddingHorizontal: 10,
              paddingTop: 10,
              paddingBottom: 0,
            }}
            onSubmitEditing={() => {
              onSearch();
            }}
          />
          <Text style={styles.labelTotal}>
            {'Total articles: '}
            <Text style={{ color: 'gray' }}> {listArticles.length}</Text>
          </Text>
          <FlatList
            data={listArticles}
            renderItem={({ item }) => {
              return <ArticleItem articleItem={item} />;
            }}
            keyExtractor={(item) => item.id.toString()}
            onEndReachedThreshold={0.4}
            onEndReached={getArticles}
          />
        </View>

        {loading ? (
          <View style={styles.loadingWrapper}>
            <ActivityIndicator size='large' color='#0000ff' />
          </View>
        ) : (
          <View />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    opacity: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
  },
  labelTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
    paddingHorizontal: 20,
    fontStyle: 'italic',
    paddingBottom: 10,
  },
});
