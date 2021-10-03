const { ApolloServer } = require('apollo-server')
const mongoose = require('mongoose')

const resolvers = require('./graphql/resolvers')
const typeDefs = require('./graphql/typeDefs')
const { MONGODB } = require('./config')

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
    .then(() => {return server.listen({ port: 8000 })})
    .then((res) => console.log(`Server started at ${res.url}`))

