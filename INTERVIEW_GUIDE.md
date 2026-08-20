# 🎯 Converse — Complete Codebase & Interview Guide

> **Full-stack real-time chat app** built with React + Vite (frontend) and Node.js + Express + Socket.io (backend), MongoDB Atlas, Cloudinary, and Gmail SMTP.

---

## 📐 Architecture Diagram

```
                         👤 USER (Browser)
                               │
                    ┌──────────▼──────────┐
                    │      FRONTEND        │
                    │   React 19 + Vite    │
                    │                      │
                    │  Pages:              │
                    │  /login  /signup     │
                    │  /verify  /          │
                    │  /chat/:id           │
                    │                      │
                    │  4 Zustand Stores:   │
                    │  Auth | ConvList     │
                    │  Conv | Messages     │
                    │  (all → localStorage)│
                    │                      │
                    │  Socket.io Client    │
                    └────┬─────────┬───────┘
                         │         │
              REST/HTTPS │         │ WebSocket (WSS)
              + JWT Cookie│         │ (persistent, bidirectional)
                         │         │
                    ┌────▼─────────▼───────┐
                    │       BACKEND         │
                    │  Node.js + Express    │
                    │  + Socket.io Server   │
                    │                       │
                    │  Middleware Chain:    │
                    │  CORS → JSON →        │
                    │  Cookie → Auth(JWT) → │
                    │  Arcjet → Multer      │
                    │                       │
                    │  /api/auth  →         │
                    │  signup, verify,      │
                    │  login, logout        │
                    │                       │
                    │  /api/messages →      │
                    │  chats, search,       │
                    │  createConversation,  │
                    │  getMessages, send,   │
                    │  delete               │
                    └──┬───────┬────────┬──┘
                       │       │        │
              ┌────────▼┐ ┌───▼────┐ ┌─▼──────┐
              │ MongoDB  │ │Cloudina│ │ Gmail  │
              │  Atlas   │ │  ry    │ │  SMTP  │
              │(Users,   │ │(Image  │ │(Email  │
              │ Convs,   │ │  CDN)  │ │Verify) │
              │ Messages)│ └────────┘ └────────┘
              └──────────┘

  Deployed: Frontend → Vercel | Backend → Render
```

---

## 📁 Project Structure Explained

```
Converse/
├── backend/
│   ├── package.json              ← "start": "node src/app.js"
│   └── src/
│       ├── app.js                ← Entry point: Express setup, CORS, routes, server listen
│       ├── socket.js             ← Socket.io server: rooms, typing, messaging events
│       ├── controller/
│       │   ├── auth.controller.js     ← signup, verify, login, logout logic
│       │   └── message.controller.js  ← getAllChats, search, createConversation,
│       │                                 getMessages, sendMessages, deleteMessage
│       ├── models/
│       │   ├── user.model.js          ← User schema + getJWT() method
│       │   ├── conversation.model.js  ← Conversation schema + pre-save sort + indexes
│       │   └── message.model.js       ← Message schema (text | image)
│       ├── route/
│       │   ├── auth.route.js          ← /api/auth routes (no auth middleware)
│       │   └── message.route.js       ← /api/messages routes (Auth middleware on all)
│       ├── middlewares/
│       │   ├── auth.js                ← Verifies JWT from cookie → attaches req.user
│       │   ├── arcjet.middleware.js   ← Rate limiting + bot detection
│       │   └── multer.js              ← File upload → streams to Cloudinary
│       ├── lib/
│       │   ├── db.js                  ← mongoose.connect(MONGO_URI)
│       │   ├── cloudinary.js          ← Cloudinary SDK config
│       │   └── arcjet.js              ← Arcjet SDK config
│       └── emails/
│           ├── sendEmail.js           ← Nodemailer transporter
│           └── emailTemplates.js      ← HTML email template for verification
│
└── frontend/
    ├── vite.config.js             ← Vite + React + Tailwind plugins
    ├── index.html                 ← Root HTML shell
    └── src/
        ├── App.jsx                ← React Router v7 routes
        ├── main.jsx               ← ReactDOM.createRoot entry
        ├── socket.js              ← Socket.io client: connect, disconnect, getSocket
        ├── pages/
        │   ├── Login.jsx          ← Email + password form
        │   ├── SignUp.jsx         ← Registration form
        │   ├── VerificationPage.jsx ← Reads ?token= from URL, calls /api/auth/verify
        │   ├── ChatLayout.jsx     ← Shell: Navbar + SideBar + <Outlet/>
        │   ├── ChatPage.jsx       ← Active chat: messages list + send box + typing indicator
        │   ├── SideBar.jsx        ← List of conversations
        │   └── Error.jsx          ← Error fallback page
        ├── components/
        │   ├── ProtectedRoute.jsx ← Reads isAuthenticated → redirects to /login if false
        │   ├── Navbar.jsx         ← Top bar with logout button
        │   ├── SearchBar.jsx      ← Search users + create new conversation
        │   ├── ListCard.jsx       ← Single chat preview card in sidebar
        │   ├── MessageList.jsx    ← Scrollable list of MessageBox components
        │   ├── messagebox.jsx     ← Individual message bubble (text or image)
        │   ├── Preview.jsx        ← Image preview before sending
        │   ├── DropdownMenu.jsx   ← Right-click/context menu (delete message)
        │   └── FuzzyText.jsx      ← Animated text effect (UI flair)
        └── store/
            ├── useAuthStore.js             ← user, token, isAuthenticated | login(), logout()
            ├── useConversationListStore.js ← chats[] | setChats, updateChat, clearChats
            ├── useConversationStore.js     ← activeConversation | set, clear
            └── useMessagesStore.js         ← messages[] | setMessages, addMessage, clear
```

---

## 🔀 Complete Flow Walkthroughs

### 1. Signup Flow

```
User fills form (firstName, lastName, email, password, age)
    │
    ▼
POST /api/auth/signup
    │
    ├─ validateUserData() → checks required fields, email format, password strength
    ├─ User.findOne({email}) → if exists → return 200 "User Already Exist"
    ├─ bcrypt.genSalt(10) + bcrypt.hash(password, salt) → hashedPassword
    ├─ age < 18 → accountType = "minor" else "adult"
    ├─ crypto.randomBytes(32).toString("hex") → verificationID (raw token sent in email)
    ├─ crypto.createHash("sha256").update(verificationID).digest("hex") → hashedToken (stored in DB)
    ├─ new User({...fields, verificationToken: hashedToken, verificationTokenExpiry: now + 1hr})
    ├─ user.save() → stored in MongoDB
    ├─ res.status(201).json({...user data, verificationToken: verificationID})
    └─ sendEmail(email, "Verify Your Email", htmlTemplate) → Gmail SMTP via Nodemailer
```

**Why SHA-256 for token, not bcrypt?**
> bcrypt is intentionally slow (to prevent brute force on passwords). For verification tokens, speed is fine because the token is random (32 bytes = 256 bits of entropy). SHA-256 is used just to avoid storing the raw token in DB.

---

### 2. Email Verification Flow

```
User receives email with link: https://yourfrontend.com/verify?token=<raw_token>
    │
    ▼
VerificationPage.jsx reads token from URL: new URLSearchParams(window.location.search)
    │
    ▼
POST /api/auth/verify { token: rawToken }
    │
    ├─ SHA-256 hash the received token → hashedToken
    ├─ User.findOne({ verificationToken: hashedToken, verificationTokenExpiry: { $gte: now } })
    ├─ If not found → "Token Expired"
    ├─ user.isVerified = true
    ├─ user.verificationToken = undefined (clears from DB)
    ├─ user.verificationTokenExpiry = undefined
    └─ user.save() → res.status(200) "Verified, Proceed to Login"
```

---

### 3. Login Flow

```
User enters email + password
    │
    ▼
POST /api/auth/login
    │
    ├─ validate email format with validator.isEmail()
    ├─ User.findOne({email}).select("+password")
    │    └─ Why .select("+password")? — password has select:false in schema
    │       (never returned by default, must be explicitly requested)
    ├─ bcrypt.compare(password, user.password) → isValidPassword
    ├─ user.isVerified === false → "Verify Your Email"
    ├─ user.getJWT() → jwt.sign({userId: this._id}, JWT_SECRET, {expiresIn: "7d"})
    ├─ res.cookie("jwt", token, {
    │       httpOnly: true,      ← JS can't read this (XSS protection)
    │       secure: true,        ← HTTPS only (in production)
    │       sameSite: "none",    ← Cross-origin allowed (Vercel + Render)
    │       maxAge: 7 days
    │  })
    └─ res.json({ user: {...}, token })
         │
         ▼
    Frontend: useAuthStore.login(data) → Zustand persists to localStorage
    Frontend: connectSocket(userId) → opens WebSocket connection
```

---

### 4. Auth Middleware Flow (Every Protected Route)

```
Incoming request to /api/messages/*
    │
    ▼
Auth middleware (auth.js)
    │
    ├─ token = req.cookies.jwt  ← cookie-parser makes this available
    ├─ if !token → 400 "Authentication Time Out"
    ├─ { userId } = jwt.verify(token, JWT_SECRET)
    ├─ user = await User.findById(userId)
    ├─ req.user = user   ← attaches user to request object
    └─ next()            ← passes to controller
```

---

### 5. Real-Time Messaging Flow

```
User A opens chat with User B (conversationId = "abc123")
    │
    ├─ GET /api/messages/getMessages/abc123 → fetch existing messages from DB
    ├─ FE_A emits → socket.emit("joinRoom", "abc123")
    │     Server: socket.join("abc123")
    │
User A types...
    ├─ socket.emit("typing", { conversationId, firstName, lastName })
    │     Server: socket.to("abc123").emit("userTyping", { firstName, lastName, isTyping: true })
    │                 └─ socket.to() sends to EVERYONE in room EXCEPT sender
    │     User B's client receives "userTyping" → shows "User A is Typing..."
    │
User A hits Send
    ├─ If text: POST /api/messages/send/abc123 { textMessage: "hello" }
    │     └─ message = new Message({ conversationId, senderId, type:"text", message:"hello" })
    │
    ├─ If image: POST /api/messages/send/abc123 (multipart/form-data)
    │     └─ Multer parses file → CloudinaryStorage uploads to Cloudinary folder "chat_images"
    │     └─ req.file.path = Cloudinary URL
    │     └─ message = new Message({ type:"image", imageUrlCloudinary: url })
    │
    ├─ message.save() → MongoDB
    ├─ Conversation.findByIdAndUpdate(id, { lastMessage: savedMsg._id })
    ├─ res.json({ message: savedMessage, updatedConversation })
    │
    ├─ FE_A: addMessage(savedMessage) → Zustand store (optimistic: shows immediately)
    ├─ FE_A: socket.emit("sendMessage", { conversationId: "abc123", message: savedMessage })
    │     Server: socket.to("abc123").emit("receiveMessage", message)
    │                 └─ Sent to everyone EXCEPT sender (User A already added it locally)
    └─ FE_B receives "receiveMessage" → addMessage() → renders new bubble
```

**Why REST first, then Socket?**
> REST saves to DB (source of truth). Socket just delivers in real-time. If WebSocket connection drops, the message is still saved — recipient can fetch it next time they load the chat. This is the correct pattern.

---

### 6. Image Upload Pipeline

```
User selects image file
    │
    ├─ handleFileChange() → URL.createObjectURL(file) → local preview (no upload yet)
    ├─ Preview.jsx renders the preview image
    │
User clicks Send
    ├─ new FormData()
    │   .append("image", file)
    │   .append("textMessage", text)   ← optional
    ├─ axios.post("/send/:id", formData, { headers: {"Content-Type": "multipart/form-data"} })
    │
    ├─ Multer middleware parses the multipart request
    │   └─ CloudinaryStorage streams file directly to Cloudinary (no disk storage)
    │   └─ Returns req.file.path = "https://res.cloudinary.com/dfmsrya96/..."
    │
    └─ Controller: message.imageUrlCloudinary = req.file.path
                   message.type = "image"
                   message.save()
```

---

### 7. Zustand Store Architecture

All 4 stores use the same pattern: `create(devtools(persist(fn, {name})))`

```js
// useAuthStore — manages logged-in user state
{
  user: null,           // { userId, firstName, lastName, email, photoUrl }
  token: null,          // JWT token string
  isAuthenticated: false,
  login(data),          // sets all three ↑
  logout()              // clears all three ↑
}
// Persisted to localStorage as key: "AuthStore"

// useConversationListStore — sidebar conversation list
{ chats: [], setChats(chats), updateChat(chat), clearChats() }
// Persisted as: "conversation-list-store"

// useConversationStore — which chat is currently open
{ activeConversation: null, setActiveConversation(conv), clearActiveConversation() }
// Persisted as: "conversation-store"

// useMessagesStore — messages for the active chat
{ messages: [], setMessages(msgs), addMessage(msg), clearMessages() }
// Persisted as: "Message-Store"
```

**Why persist?** If user refreshes the page, the app state is restored from localStorage. No re-fetch of everything needed.

**Why devtools?** You can inspect state in Redux DevTools browser extension.

---

## 🛡️ Security Design

| Layer | Implementation | Why |
|---|---|---|
| Password | `bcrypt` with 10 salt rounds | Slow by design — ~100ms per hash — prevents brute force |
| Token | SHA-256 (crypto module) | Fast for random tokens — tokens have entropy, not need for slowness |
| Session | JWT in `httpOnly` cookie | JS can't access it → XSS-safe |
| Cross-origin | `sameSite: "none"` + `secure: true` in prod | Allows cookie to travel from Vercel to Render |
| CORS | `origin: FRONTEND_URL` only | Blocks all other origins |
| Rate limiting | Arcjet | Bot detection + IP-based rate limiting |
| File uploads | Multer 5MB limit + formats whitelist | Prevents abuse |
| Authorization | Conversation membership check | User can only read/send to their own conversations |

---

## 💾 Database Design

### User Model
```js
{
  firstName, lastName,        // String, required, trimmed
  email,                      // unique, lowercase, validated by validator.js
  password,                   // select: false (never returned unless explicitly asked)
  age,                        // Number 0–110
  accountType,                // "adult" | "minor" (based on age < 18)
  authType,                   // "password" | "oauth"
  photoUrl,                   // String, default ""
  isVerified,                 // Boolean, default false
  verificationToken,          // SHA-256 hashed token
  verificationTokenExpiry,    // Date (1 hour from signup)
  timestamps: true            // createdAt, updatedAt auto-added by Mongoose
}

// Instance method:
userSchema.methods.getJWT = function() {
  return jwt.sign({ userId: this._id }, JWT_SECRET, { expiresIn: "7d" })
}
```

### Conversation Model
```js
{
  participants: [ObjectId],   // exactly 2 user IDs
  lastMessage: ObjectId,      // ref to Message — updated on every send
  timestamps: true
}

// Pre-save hook:
conversationSchema.pre('save', function() {
  this.participants.sort()    // normalize order: [A,B] and [B,A] become same
})

// Compound unique index:
{ "participants.0": 1, "participants.1": 1 } unique: true
// + Prevents duplicate conversations between same two users
// + Why it works: pre-save sorting ensures [A,B] always stored in same order

conversationSchema.index({ updatedAt: -1 })  // sort chats by latest
```

### Message Model
```js
{
  conversationId: ObjectId,       // which conversation
  senderId: ObjectId,             // who sent it
  type: "text" | "image",         // determines which field to render
  message: String,                // nullable (null for image messages)
  imageUrlCloudinary: String,     // nullable (null for text messages)
  timestamps: true
}

messageSchema.index({ conversationId: 1, createdAt: -1 })
// Fetch messages for a conversation in order — very fast
```

---

## 🔌 Socket.io Event Map

```
CLIENT → SERVER                 SERVER → CLIENT

joinRoom(conversationId)        receiveMessage(messageObj)
leaveRoom(conversationId)       userTyping({ firstName, lastName, isTyping })
sendMessage({ conversationId,
              message })
typing({ conversationId,
         firstName, lastName })
stopTyping({ conversationId,
             firstName, lastName })
```

**`socket.to(room)` vs `io.to(room)`**
- `socket.to(room).emit()` → everyone in room **EXCEPT** the sender ✅
- `io.to(room).emit()` → everyone in room **INCLUDING** sender (causes duplicates ❌)

We use `socket.to()` because the sender adds the message locally (optimistic UI) immediately after REST responds.

---

## ⚡ Express.js Crash Course

### What is Express?
A minimal web framework for Node.js. It wraps Node's `http` module and gives you routing, middleware, and request/response helpers.

### Basic Server
```js
import express from "express"
const app = express()
const server = http.createServer(app)  // raw HTTP server — needed for Socket.io

app.use(express.json())      // parse JSON bodies → req.body
app.use(cookieParser())      // parse cookies → req.cookies

app.get("/hello", (req, res) => {
  res.json({ message: "hello" })
})

server.listen(3000)
```

### Middleware
Functions that run between the request coming in and the response going out.
```js
// Format: (req, res, next) => {}
// Call next() to continue to next middleware/handler
// Return early (without calling next) to stop the pipeline

app.use((req, res, next) => {
  console.log(req.method, req.url)   // logging middleware
  next()
})
```

### Router (how routes are organized in this project)
```js
// message.route.js
const messageRouter = express.Router()
messageRouter.get("/chats", Auth, getAllChats)
//                          ^^^^ Auth is a middleware — runs before getAllChats
//                               if it calls next(), controller runs
//                               if it returns a response, controller is skipped

// app.js
app.use("/api/messages", messageRouter)
// Final URL: /api/messages/chats
```

### Middleware Pipeline Order in this Project
```
CORS → express.json() → cookieParser → [Route Match] → Auth → [Multer?] → Controller
```

### Route Parameters vs Query vs Body
```js
// Route param: /getMessages/:conversationId
req.params.conversationId     // "abc123"

// Query string: /verify?token=xyz
req.query.token               // "xyz"

// Request body (POST): { email, password }
req.body.email                // requires express.json() middleware
```

### How cookies work
```js
// Set cookie:
res.cookie("jwt", token, { httpOnly: true, secure: true, sameSite: "none" })

// Read cookie (requires cookie-parser):
req.cookies.jwt

// Clear cookie:
res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "none" })
// ⚠️ MUST use same options as when setting, otherwise browser won't clear it
```

---

## 🔌 Socket.io Crash Course

### What is Socket.io?
A library that enables real-time, bidirectional communication between browser and server over WebSockets (with fallback to HTTP long-polling).

### Server Setup
```js
import { Server } from "socket.io"
import http from "http"

const server = http.createServer(app)   // same HTTP server as Express
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", credentials: true }
})

io.on("connection", (socket) => {
  // Runs every time a client connects
  console.log("User connected:", socket.id)  // unique ID per connection

  socket.on("myEvent", (data) => {      // listen for client event
    console.log(data)
    socket.emit("response", "got it")   // send back to same client
  })

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)
  })
})
```

### Client Setup
```js
import { io } from "socket.io-client"

const socket = io("http://localhost:3000", {
  withCredentials: true,    // send cookies with WebSocket
  query: { userId }         // custom data sent during handshake
})

socket.on("connect", () => console.log("Connected:", socket.id))
socket.emit("myEvent", { data: "hello" })      // send to server
socket.on("response", (data) => console.log(data))  // receive from server
```

### Rooms (key concept in this project)
```js
// Server side:
socket.join("roomId")           // add this socket to a room
socket.leave("roomId")          // remove from room
socket.to("roomId").emit(...)   // send to ALL in room EXCEPT sender
io.to("roomId").emit(...)       // send to ALL in room INCLUDING sender

// In this project: conversationId IS the room name
socket.join(conversationId)
// All clients in same chat room receive each other's messages
```

### Handshake Query (how userId is tracked)
```js
// Client:
io(BACKEND_URL, { query: { userId: "user123" } })

// Server:
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId
  userSocketMap[userId] = socket.id
  // Now we know which socket belongs to which user
})
```

### The `userSocketMap` Pattern
```js
const userSocketMap = {}    // { userId: socketId }

// On connect: store mapping
userSocketMap[userId] = socket.id

// On disconnect: clean up
for (const [uId, sId] of Object.entries(userSocketMap)) {
  if (sId === socket.id) {
    delete userSocketMap[uId]
    break
  }
}
// Use case: if you want to send a private message to a specific user by userId:
const socketId = userSocketMap[targetUserId]
io.to(socketId).emit("privateMessage", data)
```

---

## 🎯 Interview Questions & Answers

### Architecture

**Q: Walk me through the architecture of this project.**
> React SPA on Vercel communicates with an Express + Socket.io server on Render via two channels: REST (Axios with JWT cookies) for CRUD operations, and a persistent WebSocket (Socket.io) for real-time events. MongoDB Atlas stores all data, Cloudinary serves images, Gmail SMTP handles verification emails.

**Q: Why two communication channels? Why not just WebSockets for everything?**
> REST gives us reliable request-response semantics with HTTP status codes, easy error handling, and natural CRUD mapping. WebSockets are stateful and harder to debug. We use REST as the source of truth (saves to DB), and WebSocket only for instant delivery. If the socket drops, messages are still safely saved and fetchable.

**Q: What is the middleware pipeline?**
> CORS validates origin, express.json() parses JSON bodies, cookie-parser exposes cookies. Then route matching. Protected routes hit Auth middleware which reads the JWT cookie, verifies it, and attaches the user to req.user. File upload routes then hit Multer which streams the file to Cloudinary.

---

### Authentication

**Q: How is authentication implemented?**
> JWT stored in an httpOnly cookie. httpOnly prevents JavaScript from reading it (XSS protection). On login, the server signs a JWT with the userId and sets it as a cookie. Every subsequent request automatically includes the cookie (browser behavior). Auth middleware verifies the token and attaches req.user.

**Q: What's the difference between the verification token and the JWT?**
> Verification token (SHA-256 of random bytes) is a one-time token stored in DB, used only during signup. It expires in 1 hour. JWT is a stateless session token, not stored in DB, signed with a secret. JWT expires in 7 days.

**Q: Why bcrypt for passwords but SHA-256 for verification tokens?**
> bcrypt is slow by design (10 salt rounds ≈ 100ms). This prevents brute-force attacks on passwords since attackers can only try ~10 passwords/second. Verification tokens are 32 random bytes = 256 bits of entropy — computationally infeasible to brute force regardless of hashing speed. SHA-256 is fine there.

**Q: How does the sameSite cookie work for cross-origin?**
> With Vercel (frontend) and Render (backend) on different domains, cookies with `sameSite: "strict"` won't be sent cross-origin. Setting `sameSite: "none"` (with `secure: true` required) allows cookies to travel cross-origin. This is the standard approach for decoupled frontends.

**Q: What is `select: false` on the password field?**
> It means Mongoose will never return the password field in query results unless you explicitly opt in with `.select("+password")`. Used in login to compare the submitted password with the stored hash.

---

### Real-Time & Socket.io

**Q: How does real-time messaging work?**
> Users emit "joinRoom" with conversationId when they open a chat. Server calls socket.join(conversationId). When a message is sent, REST saves it to DB first. Then the client emits "sendMessage" to the socket server, which calls socket.to(conversationId).emit("receiveMessage", message) — broadcasting to everyone in the room except the sender.

**Q: Why `socket.to()` instead of `io.to()`?**
> socket.to() excludes the sender. The sender already added the message to their local Zustand store immediately after the REST response (optimistic UI). If we used io.to(), the sender would receive "receiveMessage" and add the message again — showing it twice.

**Q: How do typing indicators work?**
> When user starts typing, the client emits "typing". Server broadcasts "userTyping" with isTyping:true to the room. The client has a debounced timer — if no keystrokes for 2 seconds, it emits "stopTyping" and the server broadcasts isTyping:false.

**Q: What is userSocketMap and why is it needed?**
> It's a plain object mapping userId to socketId. Each socket connection gets a unique socketId, but we want to target users by their userId (from our DB). This map allows us to find which socket belongs to a given user — useful for direct/private messaging outside of rooms.

---

### Database & MongoDB

**Q: How do you prevent duplicate conversations?**
> The Conversation schema has a pre-save hook that sorts the participants array: `this.participants.sort()`. This normalizes the order so [A,B] and [B,A] become [A,B]. Then a compound unique index on {participants.0, participants.1} ensures uniqueness. The sortedarray + unique index = no duplicates ever.

**Q: What is populate() in Mongoose?**
> It's Mongoose's way of doing joins. MongoDB is a document DB with no native joins. populate() replaces a stored ObjectId with the actual document it references. For example, `conversation.populate("participants")` replaces the array of user IDs with the actual user objects.

**Q: What are the database indexes in this project and why?**
> User: `{email: 1}` unique — fast login lookups. Conversation: `{participants.0, participants.1}` unique — prevents duplicates + fast lookup. Conversation: `{updatedAt: -1}` — sort chats by most recent. Message: `{conversationId, createdAt: -1}` — fetch all messages in a chat in order.

**Q: What is `select: false` vs projection?**
> select:false in schema → field never included by default. Projection in queries → explicitly include or exclude fields per query. `.select("+password")` opts back into a select:false field. `.select("firstName lastName")` projects only those two fields.

---

### Frontend / React

**Q: What is Zustand and why use it over Redux?**
> Zustand is a minimal state management library. Zero boilerplate — no actions, reducers, or dispatch needed. Just a create() with state and functions. Built-in persist middleware auto-syncs to localStorage. Built-in devtools middleware integrates with Redux DevTools. Components only re-render when their subscribed state slice changes.

**Q: What is the persist middleware doing?**
> It wraps the store and automatically serializes state to localStorage on every change, and deserializes it on app load. This means if the user refreshes, they stay logged in (isAuthenticated is true) and their conversation list is still visible.

**Q: How does ProtectedRoute work?**
> It reads isAuthenticated from useAuthStore. If false, it renders `<Navigate to="/login" />`. If true, it renders `<Outlet />` which is where the child routes (ChatLayout) render. This is React Router v6's way of implementing auth guards.

**Q: Why does the sender not receive their own message via socket?**
> The sender adds the message to their Zustand store immediately on the REST response (before even emitting to socket). When the socket broadcasts with socket.to(), the sender is excluded. So the sender sees the message instantly via optimistic update, while the receiver gets it via socket event.

**Q: What is the Outlet pattern?**
> React Router v6 nested routes. ChatLayout renders Navbar + SideBar + `<Outlet/>`. When you navigate to /chat/:id, the Outlet is replaced by ChatPage. This avoids re-rendering the sidebar and navbar on every chat switch.

---

### Image Upload

**Q: How does image upload work end to end?**
> User selects file → URL.createObjectURL() shows local preview → user clicks send → FormData with image file → Axios POST with multipart/form-data → Multer middleware parses the multipart request → CloudinaryStorage streams directly to Cloudinary (no temp disk storage) → controller gets req.file.path which is the Cloudinary URL → saved to Message document → broadcast via socket.

**Q: What is multer-storage-cloudinary?**
> A Multer storage engine that replaces the default disk storage. Instead of saving the file to disk, it streams it directly to Cloudinary. Configured with folder name and allowed formats.

**Q: What is the file size limit and how is it enforced?**
> 5MB, set via `multer({ limits: { fileSize: 5 * 1024 * 1024 } })`. Multer rejects files exceeding this before they're streamed to Cloudinary.

---

### Security

**Q: What is Arcjet?**
> A security-as-a-service SDK. Configured and run as middleware on auth routes. It detects bots (spoofed user agents), rate limits by IP, and blocks suspicious traffic. On denial, returns 429 (rate limit) or 403 (bot/policy). In dev, errors fail-open (next() is called) to avoid blocking development.

**Q: What is XSS and how does httpOnly prevent it?**
> XSS (Cross-Site Scripting) is when an attacker injects malicious JS into your page that reads `document.cookie` to steal session tokens. httpOnly cookies are not accessible via document.cookie — the browser only sends them in HTTP headers. Even if XSS happens, the JWT can't be stolen.

**Q: What is CORS and why is origin set to FRONTEND_URL specifically?**
> CORS (Cross-Origin Resource Sharing) — browsers block cross-origin requests by default. The server must explicitly allow the frontend origin. Setting origin to a specific URL (not `*`) is required when credentials (cookies) are involved — `*` + `credentials: true` is not allowed by the CORS spec.

---

### Deployment

**Q: How is this project deployed?**
> Frontend (React/Vite) is deployed to Vercel — it builds the static bundle and serves it from Vercel's CDN. Backend (Node.js/Express/Socket.io) is deployed to Render as a Web Service — Render runs `npm start` which starts the Express server. MongoDB is hosted on MongoDB Atlas cloud, Cloudinary hosts images.

**Q: Why do you need to set FRONTEND_URL in Render env vars?**
> The CORS configuration uses `process.env.FRONTEND_URL` to whitelist the allowed origin. Without this, all browser requests from the Vercel frontend would be blocked by CORS.

**Q: What is the free tier limitation on Render?**
> Render free tier spins down the service after 15 minutes of inactivity. The first request after idle takes ~30 seconds to wake up. This is a known limitation — you can work around it with a cron job that pings the service every 14 minutes.

---

## 🔑 Key Design Decisions (explain these proactively)

1. **REST + Socket hybrid** — REST for persistence, Socket for delivery. Best of both worlds.
2. **Sorted participants + compound index** — Elegant deduplication without application-level checks on every create.
3. **httpOnly + sameSite:none cookie** — Secure cross-origin auth without localStorage token exposure.
4. **Optimistic UI** — Sender's message appears instantly, receiver gets it via socket. No waiting for network.
5. **socket.to() not io.to()** — Prevents duplicate messages for sender.
6. **SHA-256 for email tokens** — Fast enough, secure enough, simpler than bcrypt for this use case.
7. **select: false on password** — Defense in depth. Even if there's a bug that accidentally returns user data, password won't leak.
8. **Zustand persist** — Survives page refresh. Better UX, less re-fetching.
9. **Conversation authorization check** — Both getMessages and sendMessages verify that the logged-in user is actually a participant in that conversation. Prevents IDOR (Insecure Direct Object Reference) attacks.
