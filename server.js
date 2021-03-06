const { ApolloServer } = require('apollo-server')
const mongoose = require('mongoose')
require('dotenv').config()

const resolvers = require('./graphql/resolvers')
const typeDefs = require('./graphql/typeDefs')
const MONGODB = process.env.MONGODB
const PORT = process.env.PORT

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req })
})

mongoose.connect(
    MONGODB,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
    )
    .then(() => {return server.listen({ port: PORT })})
    .then((res) => console.log(`Server started at ${res.url}`))

