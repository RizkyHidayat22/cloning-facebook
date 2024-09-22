import {gql} from "@apollo/client"

export const LOGIN = gql`
mutation Mutation($fields: Login) {
  login(fields: $fields) {
    statusCode
    message
    access_token
    payload
  }
}
`


export const GETPOST = gql`
query Query {
  getPost {
    _id
    content
    tags
    imgUrl
    authorId
    comments {
      content
      username
      createdAt
      updatedAt
    }
    likes {
      username
      createdAt
      updatedAt
    }
    createdAt
    updatedAt
    Author {
      _id
      name
      username
      password
      email
      Followings {
        _id
        name
        username
        password
        email
      }
    }
  }
}
`


export const REGISTER = gql`
mutation Mutation($fields: Register) {
  register(fields: $fields) {
    data {
      _id
      email
      name
      password
      username
      Followings {
        _id
        email
        name
        password
        username
      }
      Followers {
        _id
        email
        name
        password
        username
      }
    }
    statusCode
    message
  }
}
`
export const GETUSER = gql`
query Query {
  user {
    _id
    name
    username
    password
    email
    Followers {
      username
      password
      name
      email
      _id
    }
    Followings {
      username
      password
      name
      email
      _id
    }
  }
}
`

export const GETPROFILE = gql`
query Query($getProfileId: String) {
  getProfile(id: $getProfileId) {
    _id
    name
    username
    password
    email
    Followers {
      username
      password
      name
      email
      _id
    }
    Followings {
      username
      password
      name
      email
      _id
    }
  }
}
`


export const GETPOSTBYID = gql`
query GetPostById($fields: PostByIdField) {
  getPostById(fields: $fields) {
    _id
    content
    tags
    imgUrl
    authorId
    comments {
      content
      username
      createdAt
      updatedAt
    }
    likes {
      username
      createdAt
      updatedAt
    }
    createdAt
    updatedAt
    Author {
      _id
      name
      username
      password
      email
      Followers {
        username
        password
        name
        email
        _id
      }
      Followings {
        username
        password
        name
        email
        _id
      }
    }
  }
}

`

export const SEARCH = gql`
query Query($username: String!) {
  searchUser(username: $username) {
    _id
    name
    username
    password
    email
    Followers {
      _id
      name
      username
      password
      email
    }
    Followings {
      _id
      name
      username
      password
      email
    }
  }
}
`

export const ADDCOMMENT = gql`
mutation Mutation($fields: CommentFields) {
  addComment(fields: $fields)
}
`

export const ADDPOST = gql`
mutation Mutation($fields: PostFields) {
  addPost(fields: $fields) {
    _id
    content
    tags
    imgUrl
    authorId
    comments {
      content
      username
      createdAt
      updatedAt
    }
    likes {
      username
      createdAt
      updatedAt
    }
    createdAt
    updatedAt
    Author {
      _id
      name
      username
      password
      email
    }
  }
}
`

export const ADDLIKE = gql`
mutation Mutation($fields: LikeFields) {
  addLike(fields: $fields)
}`