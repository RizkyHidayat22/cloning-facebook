if(process.env.NODE_ENV !== "production"){
  require("dotenv").config();

}

const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { GraphQLError } = require("graphql");
const { ObjectId } = require("mongodb");
const { verifyToken } = require("./helpers/jwt");
const { connect, getDB } = require("./config/config");

const {userTypeDefs,userResolvers} = require('./schemas/userSchema');
const {postTypeDefs, postResolvers} = require('./schemas/postSchema');
const {responseTypeDefs} = require('./schemas/response');
const { followTypeDefs, resolversFollow } = require("./schemas/followSchema");


const server = new ApolloServer({
  typeDefs : [userTypeDefs, responseTypeDefs, postTypeDefs, followTypeDefs ],
  resolvers : [userResolvers, postResolvers, resolversFollow ],
  introspection : true
});

(async () => {
  await connect(); 
  const db = await getDB();

  const { url } = await startStandaloneServer(server, {
    listen: process.env.PORT,
    context: async ({ req, res }) => {
      console.log("this console will be triggered on every request");

    
      return {
        auth: async () => {
          const headerAuthorization = req.headers.authorization;

          if (!headerAuthorization) {
            throw new GraphQLError("You are not authenticated", {
              extensions: {
                http: "401",
                code: "UNAUTHENTICATED",
              },
            });
          }
        
          const token = headerAuthorization.split(" ")[1];
          const payload = verifyToken(token);
        //  console.log(payload);
          // const db = getDB  ();
          const users = db.collection("Users");

          const user = await users.findOne({username: payload.username});
        // console.log(user);
          if (!user) {
            throw new GraphQLError("Invalid Token", {
              extensions: {
                code: "UNAUTHORIZED",
                http: { status: 401 },
              },
            });
          }

          return payload;
        },


        db};
    },
  });

  console.log(`🚀 Server ready at ${url}`);
})();
