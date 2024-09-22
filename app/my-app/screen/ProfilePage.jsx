import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useQuery } from "@apollo/client";
import { GETPOSTBYID, GETPROFILE } from "../query";
import { SafeAreaView } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";


const MyProfileScreen = ({route}) => {
  // console.log(route);
  const profileImageUrl = "https://assets.promediateknologi.id/crop/0x0:0x0/750x500/webp/photo/2023/07/31/Gear-5-Monkey-D-Luffy-628105818.jpg";
  const coverImageUrl = "https://www.greenscene.co.id/wp-content/uploads/2021/02/One-Piece-18.jpg";

  const {
    loading: loadingById,
    error: errorById,
    data: dataById,
  } = useQuery(GETPOSTBYID, {
    variables: { fields: { _id: "66ed140967efcedbae2b3d23" } },
  });

  const { loading, error, data } = useQuery(GETPROFILE, {
    variables: { getProfileId: "66ed136a67efcedbae2b3d20" },
  });

  if (loadingById || loading) {
    return <Text>Loading.....</Text>;
  }

  if (errorById || error) {
    console.log(errorById || error);
    return (
      <SafeAreaView>
        <Text>{errorById?.message || error?.message}</Text>
      </SafeAreaView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.coverPhotoContainer}>
        <Image source={{ uri: coverImageUrl }} style={styles.coverPhoto} />
      </View>

      <View style={styles.profileContainer}>
        <View style={styles.profileImageContainer}>
          <Image source={{ uri: profileImageUrl }} style={styles.profileImage} />
        </View>

        <Text style={styles.profileName}>{data?.getProfile?.username}</Text>
        <Text style={styles.profileBio}>Loving life and living it to the fullest.</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Follow</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {data?.getProfile?.Followings?.map((friend, index) => (
            <View key={index} style={styles.friendItem}>
              <Image source={{ uri: "https://cdnwpseller.gramedia.net/wp-content/uploads/2023/02/nami.webp" }} style={styles.friendImage} />
              <Text style={styles.friendName}>{friend.name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Followers</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {data?.getProfile?.Followers?.map((friend, index) => (
            <View key={index} style={styles.friendItem}>
              <Image source={{ uri: "https://cdnwpseller.gramedia.net/wp-content/uploads/2023/02/nami.webp" }} style={styles.friendImage} />
              <Text style={styles.friendName}>{friend.name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
      <Text style={styles.postTitle}>Post</Text>
      <View style={styles.postCard}>
        <View style={styles.cardHeader}>
          <Image source={require("../assets/zoro.jpg")} style={styles.authorImage} />
          <Text style={styles.postAuthor}>{dataById.getPostById.Author.name}</Text>
        </View>
        <Text style={styles.postContent}>{dataById.getPostById.content}</Text>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: dataById.getPostById.imgUrl,
            }}
            style={styles.postImage}
            resizeMode="cover"
          />
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="heart-outline" size={24} color="black" />
            <Text style={styles.actionText}>Like</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="chatbubble-outline" size={24} color="black" />
            <Text style={styles.actionText}>Comment</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  coverPhotoContainer: {
    height: 200,
  },
  coverPhoto: {
    width: "100%",
    height: "100%",
  },
  profileContainer: {
    alignItems: "center",
    marginTop: -50,
  },
  profileImageContainer: {
    borderRadius: 75,
    overflow: "hidden",
    borderWidth: 4,
    borderColor: "#fff",
  },
  profileImage: {
    width: 150,
    height: 150,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  profileBio: {
    fontSize: 16,
    color: "#777",
    marginVertical: 10,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    marginVertical: 15,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1877f2",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: "white",
    marginLeft: 5,
    fontSize: 16,
  },
  section: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  friendItem: {
    alignItems: "center",
    marginRight: 15,
  },
  friendImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  friendName: {
    marginTop: 5,
    fontSize: 14,
  },
  postItem: {
    backgroundColor: "white",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  postContent: {
    fontSize: 16,
    color: "#333",
  },
  postCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  authorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  postAuthor: {
    fontWeight: "bold",
    fontSize: 16,
  },
  postContent: {
    fontSize: 14,
    lineHeight: 20,
  },
  imageContainer: {
    marginTop: 10,
    borderRadius: 12,
    overflow: "hidden",
  },
  postImage: {
    width: "100%",
    height: 200,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingHorizontal: 5,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    marginLeft: 5,
    fontSize: 14,
  },
  postTitle: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
});

export default MyProfileScreen;
