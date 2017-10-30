# P2P-Chat
A fun and easy messaging app that allows private conversations through P2P.
## Context
As my **Final Project** at [Spiced Academy](https://www.spiced-academy.com/), a 12 week intensive Full Stack Web Development boot camp in Berlin, I was required to come up with and develop a project of my own to showcase what I had learned and to test new ideas and technologies. 
The constraints were the following: 
- it had to be completed in just one week
- it had to be substantial but also achievable.
##### Time frame: **one week**
## Summary:
I recently participated in a one-week coding challenge where I built a secure and decentralized chat application. 
My goal was to test the architecture and tech needed to make it happen. 
The user has the ability to register, login, look up people to befriend, manage friendships, use a global chatroom, use a private chatroom or switch to a “secure” channel to protect the privacy of a conversation. 
To make all of this happen I had to build a node.js backend that used WebSocket to emit realtime events to all the relevant clients while on a React/Redux frontend I had to handle the secure chat by enabling two clients to speak directly to each other through webRtc protocol (p2p connection).
I specifically enjoyed how React in combination with Redux allowed me to clearly implement the separation of concerns principle and also write clean, functional and maintainable code.


### Tech Stack:
| **Frontend** | **Backend** | **Database** |
| ------ | ------ | ------ |
**[React.js]** | **[Node.js]** |  **[PostgreSQL]**
**[Redux.js]** | **[Express.js]** | **[AWS S3]**
**[Socket.io - client]** | **[Socket.io - server]**  
**[PeerJs - WebRTC]** |
**[Material-UI]** |
## Installation
Provide step by step series of examples and explanations about how to get a development env running.
##### Secret.json

### Features: 
- Registration | Authentication | Login
- User Search
- Friendship managment
- Global chat (through WebSocket)
- Private chat (through WebSocket)
- Secure chat (through P2P with message stored locally on your device)
### Todos
 - Write MORE Tests
 - Add Night Mode

License
----
MIT © [suddenlyGiovanni] 
**Free Software, Hell Yeah!**

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   [React.js]: <https://reactjs.org/docs/installation.html>
   [Node.js]: <https://nodejs.org/dist/latest-v8.x/docs/api/>
   [PostgreSQL]: <https://www.postgresql.org/docs/10/static/index.html>
   [Redux.js]: <http://redux.js.org/>
   [Express.js]: <http://expressjs.com/en/4x/api.html>
   [AWS S3]: <https://aws.amazon.com/documentation/s3/>
   [Socket.io - client]: <https://socket.io/docs/server-api/>
   [Socket.io - server]: <https://socket.io/docs/server-api/>
   [PeerJs - WebRTC]: <http://peerjs.com/docs/#api>
   [Material-UI]: <http://www.material-ui.com/#/>
   [suddenlyGiovanni]: <https://github.com/suddenlyGiovanni/>
