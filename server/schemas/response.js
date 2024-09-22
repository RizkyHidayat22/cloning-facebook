const responseTypeDefs = `#graphql
  
  
  interface Response {
    statusCode: String!
    message: String
  }

  type RegisterResponse implements Response{
    statusCode: String!
    message: String
    data: User
  }

  type LoginRespons implements Response{
    statusCode: String!
    message: String
    access_token: String
    payload: String
  }


`

module.exports = {
	responseTypeDefs,
}; 