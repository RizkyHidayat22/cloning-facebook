import { Text, View, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView } from "react-native";
import { useQuery } from "@apollo/client";
import { SEARCH } from "../query";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

export const SearchScreen = () => {
  const [username, setUsername] = useState("");
  const [searchTriggered, setSearchTriggered] = useState(false);
  const { loading, error, data } = useQuery(SEARCH, {
    variables: { username },
    skip: !searchTriggered,
  });

  const handleSearch = () => {
    setSearchTriggered(true);
  };

  if (loading) {
    return <Text>Loading.....</Text>;
  }

  if (!loading && error) {
    console.log(error);
    return (
      <SafeAreaView>
        <Text>{error.message}</Text>
      </SafeAreaView>
    );
  }

  return (
    <>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari berdasarkan username"
          onChangeText={(text) => setUsername(text)}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Cari</Text>
        </TouchableOpacity>
        <ScrollView style={styles.searchResultsContainer}>
          {data?.searchUser && data.searchUser.length > 0 ? (
            data.searchUser.map((user) => (
              <View key={user._id} style={styles.searchResult}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image source={require('../assets/zoro.jpg')} style={styles.userImage} />
                  <Text style={styles.userName}>{user.name}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text>No results found</Text>
          )}
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#fff",
  },
  searchButton: {
    marginTop: 10,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  searchButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  searchResultsContainer: {
    marginTop: 10,
  },
  searchResult: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginBottom: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  userImage  : {
  width: 50,
  height: 50,
  borderRadius: 25,
  marginRight: 10,
  }
});

export default SearchScreen;