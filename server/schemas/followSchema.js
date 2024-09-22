const { ObjectId } = require("mongodb");
const { GraphQLError } = require("graphql");


const followTypeDefs = `#graphql


type Follow {
    _id: ID
    followingId: ID
    followerId: ID
    createdAt: String
    updatedAt: String
  }

  input FollowField {
    followerId: ID!
  }

  type Mutation {
    addFollow(fields: FollowField): Follow
  }
`;

const resolversFollow = {
  Mutation: {
    addFollow: async (parent, args, context) => {
      const auth = await context.auth();
      const { followerId } = args.fields;
      try {
        const { db } = context;
        const user = await db.collection("Users").findOne({
          _id: new ObjectId(followerId),
        });

        if (!user) {
            throw new GraphQLError("User not found", {
              extensions: {
                code: "NOT FOUND",
                http: { status: 404 },
              },
            });
          }

          if (followerId === auth.id) {
            throw new GraphQLError("Cannot follow your self!", {
              extensions: {
                code: "BAD REQUEST",
                http: { status: 400 },
              },
            });
          }

          const existsFollows = await db.collection("Follows").findOne({
            followerId: new ObjectId(followerId),
            followingId: new ObjectId(auth.id),
          });
  
          if (existsFollows) {
            throw new GraphQLError("Already Followed", {
              extensions: {
                code: "BAD REQUEST",
                http: { status: 400 },
              },
            });
          }
  
          const follow = await db.collection("Follows").insertOne({
            followingId: new ObjectId(auth.id),
            followerId: new ObjectId(followerId),
            createdAt: new Date(),
            updatedAt: new Date(),
          });
  
          const result = await db.collection("Follows").findOne({
            _id: follow.insertedId,
          });
  
          return result;
      } catch (error) {
        console.log(error);
        throw(error)
      }
    },
  },
};

module.exports = {resolversFollow, followTypeDefs}