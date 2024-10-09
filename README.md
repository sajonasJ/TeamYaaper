# Student: Jonas Sajonas

**Student Number**: s5284977

## Course Information

**Course**: Software Frameworks  
**Course Number**: 3813ICT

---

# Table of Contents

1. [Organization of Git Repository and Usage](#organization-of-git-repository-and-usage)
2. [Data Structures Used in the Client and Server](#data-structures-used-in-the-client-and-server)
3. [Data Transfer](#data-transfer)
4. [Responsibilities Between Client and Server](#responsibilities-between-client-and-server)
5. [Routes, Parameters, Return Values, and Purpose](#routes-parameters-return-values-and-purpose)
6. [Angular Architecture: Components, Services, Models, Routes](#angular-architecture-components-services-models-routes)
7. [Interaction Between Client and Server](#interaction-between-client-and-server)
8. [Usage](#usage)

---

# Organization of Git Repository and Usage

### Repository Structure

The Git repository was initialized using the Angular CLI, which automatically created the folder structure for components, services, and pages. In addition to the default structure, custom folders such as `test`, `unitTest`, `integrationTest`, and `server` were added. These directories contain files for testing (unit and integration tests) and backend server logic. A separate `README2.md` was created to document the second phase of the project.

### Branching Strategy

Since the project was developed by one person, a simple branching strategy was used. Each phase or significant feature received its own branch. For example, a `development-branch` was created at the start of phase 2, followed by another branch for testing. This allowed for incremental development and easy integration of features.

### Commits and Version Control

The project was version-controlled using Git and hosted on GitHub at [TeamYaaper Repository](https://github.com/sajonasJ/TeamYaaper). Commits were made at key milestones, such as after adding components, implementing features, fixing bugs, making UI changes, and at major checkpoints. Commit messages followed a convention that succinctly described the changes, such as "added functions to pages" or "UI fixes." This ensured that the commit history remained clear and informative.

---

# Data Structures Used in the Client and Server

### Transition from JSON to MongoDB

In phase one, JSON files were used to represent data. During phase two, the project transitioned to a full MongoDB implementation. The JSON data was converted into MongoDB collections, and bcrypt was used to hash user passwords. MongoDB collections were initialized using Node.js, and data was modeled through interfaces on the client side.

### MongoDB Collections and Schemas

The project uses two main MongoDB collections:

- **User Collection**
- **Group Collection**

#### User Schema:

- `_id`: MongoDB `ObjectId`
- `username`: String
- `password`: String (stored as null after hashing with bcrypt)
- `firstName`: String
- `lastName`: String
- `email`: String
- `roles`: Array of strings (e.g., admin, user roles)
- `groupMemberships`: Array of strings (group IDs)
- `passwordHash`: String
- `groups`: Array of strings (group IDs)
- `profilePictureUrl`: String

#### Group Schema:

- `_id`: MongoDB `ObjectId`
- `name`: String (group name)
- `description`: String (group description)
- `admins`: Array of strings (user IDs)
- `users`: Array of strings (user IDs)
- `channels`: Array of strings (channel IDs)
- `createdAt`: String (timestamp)

#### Channel Schema:

- `name`: String
- `description`: String
- `messages`: Array of message IDs
- `users`: Array of user IDs

#### Message Schema:

- `name`: String (message sender's name)
- `text`: String (message content)
- `timestamp`: String (time the message was sent)

---

# Data Transfer

- **Login Requests**: The client sends login credentials via a `POST` request to the server. Upon successful authentication, the server responds with the user’s details, which are stored in session storage for future reference.
- **Fetching Groups**: The client uses a `GET` request to retrieve a list of groups that the authenticated user belongs to. The server responds with a JSON array of group data.
- **Data Display Requests**: The client sends `GET` requests to display data such as group details, user profiles, or messages. The server responds with corresponding JSON data.
- **Update Requests**: Updates to entities (e.g., user profiles, groups, channels) are handled via `PUT` requests. The server processes the update and returns a confirmation response.
- **Delete Requests**: Deletions (e.g., users, groups) are handled via `DELETE` requests. The server confirms the deletion and returns a success message.
- **Real-Time Messaging**: `socket.io` handles real-time communication. The server pushes new messages to connected clients, and the client instantly updates the chat interface.
- **Image Uploads**: Image uploads are managed using the `formidable` package. The client sends the image via a `POST` request, and the server saves it, storing the file path in MongoDB.

---

# Responsibilities Between Client and Server

### Client-Side Responsibilities

- **Static and Dynamic UI**: The client renders static pages and dynamically updates the UI based on user actions and data received from the server.
- **Data Display and Logic**: The client manages the logic for displaying data retrieved from the server, including showing or hiding components based on the logged-in user’s role.
- **Routing**: The client handles navigation between different pages, allowing users to switch between views (e.g., dashboard, group pages) through client-side routing.
- **User-Specific Behavior**: Depending on the user’s status, the client shows appropriate components and data.

### Server-Side Responsibilities

- **Database Management (CRUD Operations)**: The server handles creating, reading, updating, and deleting (CRUD) operations for users, groups, and channels in MongoDB.
- **Real-Time Communication**: The server manages real-time interactions through `socket.io`, facilitating live messaging and updates between users.
- **Image Upload and Management**: The server processes image uploads using `formidable`, stores them, and handles routes for displaying images.
- **API Endpoints**: The server exposes REST API routes that allow the client to fetch and manipulate data for user authentication, group and channel management, and messaging.
- **Socket and MongoDB Integration**: The server saves messages and other real-time events to MongoDB for persistent storage of chat history.

---

# Routes, Parameters, Return Values, and Purpose

| Route                             | Parameters                                | Return Values    | Purpose                                       |
| --------------------------------- | ----------------------------------------- | ---------------- | --------------------------------------------- |
| `/groups/:id/admin`               | `username`, `groupID`                     | Success or fail  | Add admins to a group                         |
| `/groups/:groupId/channels`       | `groupID`, `channelName`                  | Success or fail  | Add channels to a group                       |
| `/groups/:id/user`                | `groupID`, `username`                     | Success or fail  | Add users to a group                          |
| `/addUser`                        | `username`, `password`, `firstName`, etc. | Success or fail  | Create a user                                 |
| `/groups/add`                     | `name`, `description`, `admins`, etc.     | Success or fail  | Create a group                                |
| `/uploadProfilePicture/:userId`   | `userID`, `imageFile`                     | Success or fail  | Upload user profile picture                   |
| `/addJoinRequest`                 | `groupID`, `username`                     | Success or fail  | Add a join request to a group                 |
| `/users/:username/makeSuper`      | `username`                                | Success or fail  | Promote a user to Super User                  |
| `/deleteGroup/:groupId`           | `groupId`                                 | Success or fail  | Delete a group                                |
| `/users/:username`                | `username`                                | Success or fail  | Delete a user                                 |
| `/allUsers`                       | None                                      | User data        | Load all user data                            |
| `/showChat/:groupId/:channelName` | `groupID`, `channelName`                  | Channel messages | Display all messages of a channel             |
| `/verify`                         | `username`, `password`                    | User data        | Authenticate and return the current user data |
| `/allGroups`                      | None                                      | Group data       | Fetch all groups                              |
| `/allGroups/:id`                  | `groupId`, `updatedGroupData`             | Success or fail  | Update a group                                |
| `/updateUser/:userId`             | `userID`, `updatedUserData`               | Success or fail  | Update user data                              |

---

# Angular Architecture: Components, Services, Models, Routes

### Components:

- **Content**: Displays data for the home page. Switches between other components for display.
- **Side-nav**: Holds navigation for different groups, allows group creation, and emits the selected group to the Content component.
- **Sign-up**: Allows users to sign up and log in automatically after successful registration.
- **Login**: Handles user authentication and site navigation.

### Pages:

- **Account Page**: Displays user data and allows profile picture changes.
- **Dashboard Page**: Displays user and group data, allows creation of users and groups, and is the main control page for Super Users.
- **Home Page**: Contains the side navigation and content, and is the main interaction page for users to chat.

### Services:

- **authService**: Handles authentication controls.
- **groupService**: Contains routes for group management.
- **join-requestService**: Manages routes for group join requests.
- **socketService**: Manages backend socket connections for chatting.
- **userService**: Manages backend routes for user data.

### Models:

- **dataInterfaces**: Defines the schema for users, groups, messages, channels, and joinRequests.

---

# Interaction Between Client and Server

The client and server interact via REST APIs and `socket.io` for real-time messaging.

- **User Authentication**: The client sends login credentials via a `POST` request, and the server responds with user details, which are stored in session storage.
- **Fetching Data**: The client sends `GET` requests to retrieve groups, channels, and user details, which are returned in JSON format and rendered by Angular components.
- **Real-Time Messaging**: The server uses `socket.io` to push messages to connected clients, updating the chat interface instantly.
- **CRUD Operations**: Actions like creating, reading, updating, and deleting users, groups, and channels are handled via `POST`, `GET`, `PUT`, and `DELETE` requests.
- **Image Uploads**: Handled by the `formidable` package via `POST` requests, and stored paths are saved in MongoDB.
- **Role Management**: The client adjusts UI based on user roles, and the server validates permissions for access control.

---

# Usage

To set up and run the project:

1. **Clone the repository**:

```bash
git clone https://github.com/sajonasJ/TeamYaaper
```

2. **Install dependencies**:

```bash
npm install
```

3. **Start the server (inside the server folder)**:

```bash
cd server
node server
```

4. **Start the Angular project**:

```bash
ng serve --open
```

5. **Run Unit Tests**:

```bash
ng test
```
