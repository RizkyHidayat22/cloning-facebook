const { getDB } = require("../config/config");
const { ObjectId } = require("mongodb");
const { GraphQLError } = require("graphql");
const redis = require("../config/redis")

const postTypeDefs = `#graphql

    type Comment{
        content: String!
        username: String!
        createdAt: String
        updatedAt: String
    }

    type Like {
        username: String!
        createdAt: String
        updatedAt: String
  }

    type Post {
        _id: ID
        content: String!
        tags: [String]
        imgUrl: String
        authorId: ID!
        comments: [Comment]
        likes: [Like]
        createdAt: String
        updatedAt: String
        Author: User
  }

  input PostFields{
        content: String
        imgUrl: String
        tags: [String]
  }

  input CommentFields{
    PostId: ID!
    content: String!
  }
  input PostByIdField{
    _id: ID!
  }
  
  input LikeFields{
    PostId: ID!
  }
  type Query{
    getPost: [Post]
    getPostById(fields: PostByIdField) : Post
  }
  
  type Mutation{
    addPost(fields: PostFields ): Post
    addComment(fields: CommentFields) : String
    addLike(fields: LikeFields) : String
  }

`;

const postResolvers = {
  Query: {
    getPost: async (_, __, context) => {
      const auth = await context.auth();
      try {
        const { db } = context;
        const redisCache = await redis.get("posts");
        if (redisCache) {
          return JSON.parse(redisCache);
        }
        const agg = [
          {
            $lookup: {
              from: "Users",
              localField: "authorId",
              foreignField: "_id",
              as: "Author"
            }
          },
          {
            $project: {
              "Author.password": 0
            }
          },
          {
            $unwind: {
              path: "$Author",
              preserveNullAndEmptyArrays: true
            }
          }
        ]
        // console.log(agg);
        const post = await db.collection("Posts").aggregate(agg).toArray();
        // console.log(post);
        if (!post) {
          throw new GraphQLError("Post not found", {
            extensions: {
              code: "NOT FOUND",
              http: { status: 404 },
            },
          });
        }
        redis.set("Posts", JSON.stringify(post));

        return post;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    getPostById: async (parent, args, context) => {
      const auth = await context.auth();
      const { _id } = args.fields;
      try {
        const {db} = context
        const agg = [
          {
            $match: {
              _id: new ObjectId(_id),
            },
          },
          {
            $lookup: {
              from: "Users",
              localField: "authorId",
              foreignField: "_id",
              as: "Author",
            },
          },
          {
            $project: {
              "Author.password": 0,
            },
          },
          {
            $sort: {
              createdAt: -1,
            },
          },
          {
            $unwind: {
              path: "$Author",
              preserveNullAndEmptyArrays: true,
            },
          },
        ]

        const post = await db.collection("Posts").aggregate(agg).toArray();
        // console.log(post);

        return post[0];
      } catch (error) {
        console.log(error);
      }
    }
  },
  Mutation: {
    addPost: async (parent, args, context) => {
  const auth = await context.auth();
  const { content, imgUrl, tags } = args.fields;

  if (!content || content.trim() === "") {
    throw new GraphQLError("Content cannot be empty", {
      extensions: {
        code: "BAD_USER_INPUT",
        http: { status: 400 },
      },
    });
  }

  try {
    const { db } = context;
    const data = {
      content,
      imgUrl,
      tags,
      authorId: new ObjectId(auth.id),
      comments: [],
      likes: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const post = await db.collection("Posts").insertOne(data);

    const agg = [
      {
        $match: { _id: new ObjectId(post.insertedId) },
      },
      {
        $lookup: {
          from: "Users",
          localField: "authorId",
          foreignField: "_id",
          as: "Author",
        },
      },
      {
        $unwind: {
          path: "$Author",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          "Author.password": 0, 
        },
      },
    ];

    const result = await db.collection("Posts").aggregate(agg).toArray();

    if (!result || result.length === 0) {
      throw new GraphQLError("Post not found", {
        extensions: {
          code: "NOT FOUND",
          http: { status: 404 },
        },
      });
    }

    redis.del("Posts");
    return result[0]; 
  } catch (error) {
    console.log(error);
    throw error;
  }
},

    addComment: async (parent, args, context) => {
      const auth = await context.auth();
      const { PostId, content } = args.fields; 
      try {
        const { db } = context;
        await db.collection("Posts").updateOne(
          { _id: new ObjectId(PostId) },
          {
            $push: {
              comments: {
                content,
                username: auth.username,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            },
          }
        );
         redis.del("Posts");

        return "Comment added successfully";
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    addLike: async (parent, args, context) => {
      const auth = await context.auth()
      const {PostId} = args.fields
      try {
        const {db} = context
        await db.collection("Posts").updateOne(
          {
            _id: new ObjectId(PostId),
          },
          {
            $push: {
              likes: {
                username: auth.username,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            },
          }
        )
         
        redis.del("Posts");

        return "succes add like"
      } catch (error) {
        console.log(error);
      }
    }
  },
};

module.exports = { postResolvers, postTypeDefs };
