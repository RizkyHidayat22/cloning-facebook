import React, { useContext, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { LoginContext } from "../context/LoginContext";
import * as SecureStore from "expo-secure-store";
import { useQuery, useMutation } from "@apollo/client";
import { ADDLIKE, ADDPOST, GETPOST } from "../query";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { setIsLoggedIn } = useContext(LoginContext);
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [showPostContainer, setShowPostContainer] = useState(false);
  const [posts, setPosts] = useState([]);

  const [addPost] = useMutation(ADDPOST, {
    onCompleted: (data) => {
      setPosts((prevPosts) => [...prevPosts, data.addPost]);
      setContent("");
      setImgUrl("");
      setTag("");
      setShowPostContainer(false);
    },
  });

  const [addLike] = useMutation(ADDLIKE);

  const { loading, error, data } = useQuery(GETPOST, {
    onCompleted: (data) => {
      setPosts(data.getPost);
    },
  });

  if (loading) {
    return <Text>Loading.....</Text>;
  }

  if (error) {
    console.log(error);
    return (
      <SafeAreaView>
        <Text>{error.message}</Text>
      </SafeAreaView>
    );
  }

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("access_token");
    setIsLoggedIn(false);
    navigation.navigate("Login");
  };

  const handleAddPost = async () => {
    try {
      await addPost({
        variables: {
          fields: {
            content,
            imgUrl,
            tags: tag,
          },
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      await addLike({ variables: { fields: { PostId: postId } } });
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, likes: [...post.likes, { userId: "currentUserId" }] } 
            : post
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

 const renderPostItem = ({ item }) => {
    const isLiked = item.likes.some(like => like.userId === "currentUserId"); 
    return (
      <TouchableOpacity
        style={styles.postCard}
        onPress={() => navigation.navigate("Detail", { postId: item["_id"] })}
      >
        <View style={styles.postCard}>
          <View style={styles.cardHeader}>
            <Image source={require("../assets/zoro.jpg")} style={styles.authorImage} />
            <Text style={styles.postAuthor}>{item.Author.name}</Text>
          </View>
          <Text style={styles.postContent}>{item.content}</Text>
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.imgUrl }} style={styles.postImage} resizeMode="cover" />
          </View>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton} onPress={() => handleLikePost(item._id)}>
              <Icon name="heart" size={24} color={isLiked ? "red" : "black"} />
              <Text style={styles.actionText}>Like {item.likes.length}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
 
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>facebook</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate("Search")}>
            <Icon name="search-outline" size={30} color="black" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}>
            <Icon name="exit-outline" size={30} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity onPress={() => setShowPostContainer(!showPostContainer)} style={styles.newPostButton}>
        <Text style={styles.newPostButtonText}>Create New Post</Text>
      </TouchableOpacity>

      {showPostContainer && (
        <View style={styles.newPostContainer}>
          <View style={styles.newPostHeader}>
            <Text style={styles.newPostText}>What are you thinking?</Text>
            <TouchableOpacity>
              <Icon name="person-circle-outline" size={30} color="black" />
            </TouchableOpacity>
          </View>

          <TextInput style={styles.inputContent} placeholder="What are you thinking..." value={content} onChangeText={setContent} />

          <TextInput style={styles.inputImgUrl} placeholder="Add image URL..." value={imgUrl} onChangeText={setImgUrl} />

          <TextInput style={styles.inputTags} placeholder="Add tags..." value={tag} onChangeText={setTag} />

          <TouchableOpacity style={styles.newPostButton} onPress={handleAddPost}>
            <Text style={styles.newPostButtonText}>Add New Post</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList style={styles.feed} data={posts} renderItem={renderPostItem} keyExtractor={(item) => item._id.toString()} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#007bff",
    elevation: 2,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  headerIcons: {
    flexDirection: "row",
  },
  icon: {
    marginRight: 15,
  },
  feed: {
    flex: 1,
    padding: 10,
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
  commentsContainer: {
    marginTop: 10,
  },
  commentItem: {
    marginBottom: 5,
  },
  commentAuthor: {
    fontWeight: "bold",
    fontSize: 14,
  },
  commentContent: {
    fontSize: 14,
    marginLeft: 5,
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  commentInput: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
    paddingLeft: 10,
  },
  newPostContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  newPostHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  newPostText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  inputContent: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  inputImgUrl: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  inputTags: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  newPostButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  newPostButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HomeScreen;
