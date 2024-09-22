const { hash } = require("../helpers/bcrypt");

const { ObjectId } = require("mongodb");
const { makeToken } = require("../helpers/jwt");
const { compare } = require("../helpers/bcrypt");
const { GraphQLError } = require("graphql");


const userTypeDefs = `#graphql

  type User {
    _id: ID!
    name: String!
    username: String!
    password: String
    email: String!
    Followers: [User]
    Followings: [User]
  }

  input Register {
    name: String!
    username: String!
    email: String!
    password: String!
 }

 input Login{
    username: String!
    password: String!
 }
  type Query {
    user: [User]
    getProfile(id: String): User
    searchUser(username: String!): [User]
  }


  type Mutation{
    register(fields: Register) : RegisterResponse
    login(fields: Login) : LoginRespons
  }
  

`;
const userResolvers = {
  Query: {
    user: async (parent, args, context) => {
      const auth = await context.auth();
      try {
        const { db } = context;
        const agg = [
          {
            $lookup: {
              from: "Follows",
              localField: "_id",
              foreignField: "followingId",
              as: "Followings",
            },
          },
          {
            $lookup: {
              from: "Users",
              localField: "Followings.followerId",
              foreignField: "_id",
              as: "Followings",
            },
          },
          {
            $project: {
              password: 0,
              "Followings.password": 0,
            },
          },
          {
            $lookup: {
              from: "Follows",
              localField: "_id",
              foreignField: "followerId",
              as: "Followers",
            },
          },
          {
            $lookup: {
              from: "Users",
              localField: "followers.followingId",
              foreignField: "_id",
              as: "Followers",
            },
          },
          {
            $project: {
              "Followers.password": 0,
            },
          },
        ];

        const user = await db.collection("Users").aggregate(agg).toArray();
        console.log(user);
        return user;
      } catch (error) {
        console.log(error);
      }
    },
    searchUser: async (parent, args, context) => {
      const auth = await context.auth();
      const { username } = args;
      try {
        const { db } = context;
        const users = await db.collection("Users").find({ username: { $regex: username, $options: 'i' } }).toArray();
        return users;
      } catch (error) {
        console.log(error);
      }
    },
    getProfile: async (parent, args, context) => {
      const auth = await context.auth();
      // console.log(auth);
      const {id} = args
      try {
        const {db} = context;
        const agg = [
          {
            $match: {
              _id: new ObjectId(id),
            },
          },
          {
            $lookup: {
              from: "Follows",
              localField: "_id",
              foreignField: "followingId",
              as: "Followings",
            },
          },
          {
            $lookup: {
              from: "Users",
              localField: "Followings.followerId",
              foreignField: "_id",
              as: "Followings",
            },
          },
          {
            $project: {
              password: 0,
              "Followings.password": 0,
            },
          },
          {
            $lookup: {
              from: "Follows",
              localField: "_id",
              foreignField: "followerId",
              as: "Followers",
            },
          },
          {
            $lookup: {
              from: "Users",
              localField: "Followers.followingId",
              foreignField: "_id",
              as: "Followers",
            },
          },
          {
            $project: {
              "Followers.password": 0,
            },
          },
        ];

        const user = await db.collection("Users").aggregate(agg).toArray();
        if (!user) {
          throw new GraphQLError("User not found", {
            extensions: {
              code: "NOT FOUND",
              http: { status: 404 },
            },
          });
        }
        return user[0];
      } catch (error) {
        console.log(error);
        throw error
      }
    }

  },
  Mutation: {
    register: async (parent, args, context) => {
      const { name, username, email, password } = args.fields;

      try {
        if (password.length < 5) {
          throw new GraphQLError("password must be more than 5 character", {
            extensions: {
              code: "BAD REQUEST",
              http: { status: 400 },
            },
          });
        }
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
          throw new GraphQLError("email invalid format", {
            extensions: {
              code: "BAD REQUEST",
              http: { status: 400 },
            },
          });
        }
        const { db } = context;
        const existingUser = await db.collection("Users").findOne({ username });

        if (existingUser) {
          throw new GraphQLError("Username has been used", {
            extensions: {
              code: "BAD REQUEST",
              http: { status: 400 },
            },
          });
        }

        const existingEmail = await db.collection("Users").findOne({ email });

        if (existingEmail) {
          throw new GraphQLError("Email has been used", {
            extensions: {
              code: "BAD REQUEST",
              http: { status: 400 },
            },
          });
        }

        const result = await db.collection("Users").insertOne({
          name,
          username,
          email,
          password: hash(password),
        });

        const { id } = result.insertedId;
        const query = { _id: new ObjectId(id) };
        const newUser = await db.collection("Users").findOne(query);
        // console.log(newUser);
        return {
          statusCode: 201,
          message: "register succeed",
          data: newUser,
        };
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    login: async (parent, args, context) => {
      // console.log("masok");
      const { username, password } = args.fields;
      try {
        if (!args.fields) {
          throw new GraphQLError("invalid input", {
            extensions: {
              code: "BAD REQUEST",
              http: { status: 400 },
            },
          });
        }
        const { db } = context;
        const user = await db.collection("Users").findOne({
          username,
        });

        if (!user) {
          throw new GraphQLError("Invalid Email OR Password", {
            extensions: {
              code: "UNAUTHENTICATED",
              http: { status: 401 },
            },
          });
        }

        if (!compare(password, user.password)) {
          throw new GraphQLError("Invalid Email OR Password", {
            extensions: {
              code: "UNAUTHENTICATED",
              http: { status: 401 },
            },
          });
        }
        // console.log(user);

        const payload = {
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
        };

        const token = makeToken(payload);

        return {
          statusCode: 200,
          message: "Login Successfully",
          access_token: token,
          payload: payload.id
        };
      } catch (error) {
        console.log(error);
        throw error
      }
    },
  },
};

module.exports = { userTypeDefs, userResolvers };
