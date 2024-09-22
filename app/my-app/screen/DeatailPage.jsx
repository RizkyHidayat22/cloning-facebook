import { View, Text, Image, StyleSheet, FlatList, TextInput, Button } from "react-native";
import { useQuery, useMutation } from "@apollo/client";
import { ADDCOMMENT, GETPOSTBYID } from "../query";
import { useState } from "react";

const DetailScreen = ({ route }) => {
  const postId = route?.params?.postId;
  const [comment, setComment] = useState("");
  
  const { loading, error, data } = useQuery(GETPOSTBYID, {
    variables: { fields: { _id: postId } },
  });

  const [addComment] = useMutation(ADDCOMMENT, {
    onCompleted: () => {
      setComment(""); 
    },
    refetchQueries: [{ query: GETPOSTBYID, variables: { fields: { _id: postId } } }], 
  });

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const post = data.getPostById;

  const renderComment = ({ item }) => (
    <View style={styles.commentContainer}>
      <Text style={styles.commentAuthor}>{item.username}</Text>
      <Text style={styles.commentContent}>{item.content}</Text>
    </View>
  );

  const handleCommentSubmit = () => {
      addComment({
        variables: {
          fields: {
            content: comment,
            PostId: postId,
          },
        },
      });

  };

  return (
    <View style={styles.container}>
      <Text style={styles.postAuthor}>{post.Author.name}</Text>
      <Text style={styles.postContent}>{post.content}</Text>
      {post.imgUrl && <Image source={{ uri: post.imgUrl }} style={styles.postImage} />}
      <FlatList
        data={post.comments}
        renderItem={renderComment}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.commentsContainer}
      />
      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment..."
          value={comment}
          onChangeText={setComment}
        />
        <Button title="Submit" onPress={handleCommentSubmit} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  postAuthor: {
    fontWeight: "bold",
    fontSize: 18,
  },
  postContent: {
    fontSize: 16,
    marginVertical: 10,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  commentsContainer: {
    marginTop: 20,
  },
  commentContainer: {
    marginBottom: 10,
    padding: 15,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  commentAuthor: {
    fontWeight: "bold",
    fontSize: 15,
  },
  commentContent: {
    fontSize: 14,
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  commentInput: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
});

export default DetailScreen;
