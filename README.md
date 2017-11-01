# P2P-Chat
A fun and easy messaging app that allows private conversations through P2P.

### Table of contents
* [Context](#context)
* [Summary](#summary)
* [Tech Stack](#tech-stack)
* [Installation](#installation)
* [Features](#features)
* [Todos](#todos-of-additional-features)
* [Contact && License](#contact)


## Context
Between July and October 2017, I attend **[SPICED Academy]**, an intensive 12-week coding program focused on Full Stack JavaScript Web Development in Berlin.
During this program, I built a portfolio of web applications.
1. **[Reichstag]** - a static landing page
2. **[Kitty Carousel]** - a carousel/slideshow element that displays kitties picture
3. **[Resizable Panes]** - an element to display before and after photos
4. **[Incremental Search]** - search field that allows users to select matching results
5. **[Connect Four]** - the vertical checkers game
6. **[Spotify API Search]**
7. **[Github API Search]**
8. **[Ticker Twitter API]** - a sliding twitter news feed element
9. **[Petition]** - A server-side render app for collecting signatures for a pledge.
10. **[Imageboard]** - An app that allows users to upload images, comment, and like images.
11. **[Social Network]** - Mock social network project for superheroes and villains.
12. Final Project - one-week coding challenge - **[P2P Chat]**
 
As my **Final Project** I was required to come up with and develop a project of my own to showcase what I had learned and to test new ideas and technologies. 
The constraints were the following: 
- it had to be completed in just one week
- it had to be substantial but also achievable.
###### Timeframe:  _**One week**_
###### New Technologies:  
- PeerJs (WebRTC)

## Summary:
Recently I've participated in a one-week coding challenge where I set myself to build a **secure and decentralized chat application**. 
**My goal** with this application **was to test the architecture and tech needed to make it happen**. 
The user has the ability to register, login, look up people to befriend, manage friendships, use a global chatroom, use a private chatroom or switch to a “secure” channel to protect the privacy of a conversation. To make all of this happen, I had to build a node.js backend that used WebSocket to emit real-time events to all the relevant clients while on a React/Redux frontend I had to handle the secure chat by enabling two clients to speak directly to each other through webRtc protocol (p2p connection).
I especially enjoyed how React in combination with Redux allowed me to explicitly implement the separation of concerns principle and also write clean, functional and maintainable code.


### Tech Stack:
| **Frontend** | **Backend** | **Database** |
| ------ | ------ | ------ |
**[React.js]** | **[Node.js]** |  **[PostgreSQL]**
**[Redux.js]** | **[Express.js]** | **[AWS S3]**
**[Socket.io - client]** | **[Socket.io - server]**  
**[PeerJs - WebRTC]** |
**[Material-UI]** |
## Installation
```bash
$ git clone https://github.com/suddenlyGiovanni/p2p-chat.git
$ cd p2p-chat
$ npm install
$ cd config && touch secrets.json
```
##### Secret.json
Paste in the following code and remember to configure [PostgreSQL] and [AWS S3] it accordingly... 
```javascript
{
    "psqlConfig": "postgres:postgres:postgres@localhost:5432/p2p-chat",
    "sessionSecret": "this is a secret!!",
    "bcryptSalt": "this is a secret!!",
    "AWS_KEY": "XXXXXXX",
    "AWS_SECRET": "XXXXXXX/XXXXXXX/",
    "AWS_BUCKET": "p2p-chat",
    "s3Url": "https://s3.amazonaws.com/XXXXXXX/"
}
```

## Features: 
> As a user, I can **register and login**. If I am already login, I can skip this step.

The user can create or submit its credentials: Passwords are hashed using the bcrypt library.
Forms include CSRF protection using the csurf npm package.

> As a user, I can **personalize my profile picture**.

> As a user, I can **see who of my friends is online now**.

> As a user, I can **find friends using the search box**. 

This Feature is implemented as an incremental search field. 
Input events result in ajax requests, and the route hit does a database queries with pattern matching to find matches.

> > As a user, I can **see a list of all of my friends**. I can also **manage friendship status**: 
> I can send a friendship request,
> I can cancel ann erroneous friendship request,
> I can accept friends requests,
> I can terminate friendships

> As a user, I can **use the group chat** feature to chat with everyone that is online.

> As a user, I can **use the private chat** to talk to other friends that can be **either online or offline**.

> As a user, I can **use the secure chat** to talk to other friends.

This feature is achieved by enabling **two clients to speak directly to each other through the webRTC** protocol (p2p connection).
The **messages** payload **are stored only locally** in the redux store of each client. They are also not persistent.

## Todos of additional features:
 - [ ] **Temp:**

## Contact
* e-mail: ravalico.giovanni@gmail.com
* Twitter: [@superspacezova](https://twitter.com/superspacezova "twitterhandle on twitter")
* LinkdeIn: [/giovanni-ravalico]

License
----
MIT © [suddenlyGiovanni] 
**Free Software, Hell Yeah!**

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

[//]: # (Contact references:)
   [Spiced Academy]: <https://www.spiced-academy.com/>
   [suddenlyGiovanni]: <https://github.com/suddenlyGiovanni/>
   [/giovanni-ravalico]: <https://www.linkedin.com/in/giovanni-ravalico/>
   [@superspacezova]: <https://twitter.com/superspacezova>
   
[//]: # (Context references:)
   [Reichstag]: <https://github.com/suddenlyGiovanni/reichstag>
   [Kitty Carousel]: <https://github.com/suddenlyGiovanni/kitty_carousel>
   [Resizable Panes]: <https://github.com/suddenlyGiovanni/resizable_panes>
   [Incremental Search]: <https://github.com/suddenlyGiovanni/incremental_search>
   [Connect Four]: <https://github.com/suddenlyGiovanni/connect_four>
   [Spotify API Search]: <https://github.com/suddenlyGiovanni/spotify_api_search>
   [Github API Search]: <https://github.com/suddenlyGiovanni/github_api_search>
   [Ticker Twitter API]: <https://github.com/suddenlyGiovanni/ticker_twitter_api>
   [Petition]: <https://github.com/suddenlyGiovanni/petition>
   [Imageboard]: <https://github.com/suddenlyGiovanni/imageboard>
   [Social Network]: <https://github.com/suddenlyGiovanni/socialnetwork>
   [P2P Chat]: <https://github.com/suddenlyGiovanni/p2p-chat>
   
[//]: # (Tech Stack references:)
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
