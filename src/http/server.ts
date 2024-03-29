import fastify from 'fastify'
import cookie from '@fastify/cookie'
import websocket from '@fastify/websocket'
import { createPoll } from './routes/create-poll'
import { getPoll } from './routes/get-poll'
import { voteOnPoll } from './routes/vote-on-poll'
import { pollResults } from './ws/poll-results'
const app = fastify()

//                      ROTAS BASE DE API
//  GET,    POST,    PUT,       DELETE,           PATCH,           
// buscar   criar   alterar     deletar     alteraçao especifica

app.register(cookie, {
    secret: "poll-app",    
    hook: 'onRequest',      
})

app.register(websocket)

app.register(createPoll)
app.register(getPoll)
app.register(voteOnPoll)

app.register(pollResults)

app.listen( { port: 3333} ).then(() =>{
    console.log("HTTP server running!")
})