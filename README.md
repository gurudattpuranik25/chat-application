
# Backend Service for a Chat Application

An efficient and scalable backend service built using Node.js and MongoDB to power a real-time Chat Application. This service manages authentication, and authorization and provides seamless interaction. 
MongoDB serves as the persistent data storage, enabling secure and flexible data management for messages and user profiles. 



## Tech Stack

**Server:** Node, Express, MongoDB


## NPM Packages Used
- bcrypt
- express
- jsonwebtoken
- mongodb
- mongoose
- nodemon
- socket.io
- validator


## Features

- User authentication & authorization
- Session storage
- Create a chat room
- Join a chat room
- Leave the chat room
- Send a message to room participants



## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`MONGODB_USERNAME`

`MONGODB_PASSWORD`

`JWT_SECRET_KEY`


## API Reference

#### Registration

```http
  POST http://localhost:3000/auth/register
```

#### Login

```http
  POST http://localhost:3000/auth/login
```

#### Logout

```http
  POST http://localhost:3000/auth/logout
```

#### Create room

```http
  POST http://localhost:3000/rooms/create-room
```

#### Join room

```http
  POST http://localhost:3000/rooms/join-room
```

#### Leave room

```http
  POST http://localhost:3000/rooms/leave-room
```

#### Send message

```http
  POST http://localhost:3000/messages/send
```

## Run Locally

Clone the project

```bash
  git clone https://github.com/gurudattpuranik25/chat-application.git
```

Go to the project directory

```bash
  cd chat_application
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm start
```


## Feedback

If you have any feedback, please reach out to me at guruhp999@gmail.com

