# Team Yaaper Chat Web Application

## Student Information

- **Student:** Jonas Sajonas
- **Student Number:** s5284977

## Course Information

- **Course:** Software Frameworks
- **Course Number:** 3813ICT

## Table of Contents

1. [Overview](#overview)
2. [Git Repository Organization](#git-repository-organization)
   - [Repository Structure](#repository-structure)
   - [Update Frequency](#update-frequency)
   - [Server/Front-end Separation](#serverfront-end-separation)
3. [Data Structures](#data-structures)
   - [Client-Side Data Structures](#client-side-data-structures)
   - [Server-Side Data Structures](#server-side-data-structures)
4. [Angular Architecture](#angular-architecture)
   - [Components](#components)
   - [Services](#services)
   - [Models](#models)
   - [Routes](#routes)
5. [Node Server Architecture](#node-server-architecture)
   - [Modules](#modules)
   - [Functions](#functions)
   - [Files](#files)
   - [Global Variables](#global-variables)
6. [Installation](#installation)
7. [Usage](#usage)

## Overview

The project is a messaging application with real-time chat and video call capabilities, designed for gamers aged 15-30. The application features a dark theme with neon colors and belongs to the technology and communication sector. Planned functionalities include real-time chatting, video calls, sign-up, creating groups, and joining groups.

## Git Repository Organization

### Repository Structure

- **Branches:**
  - The Git repository currently has three branches: `origin`, `createserver`, and `addServerFunc`.
  - The `origin` branch is the main branch where initial drafts and project requirements were added.
  - The `createserver` branch was created to set up the server and ensure initial routes were functional.
  - The `addServerFunc` branch focused on adding more complex server functions such as adding, updating, and deleting data.
  - Small tasks like adding libraries, editing the UI, and fixing bugs were managed directly on the respective branches and merged back to `origin` once completed.

### Update Frequency

- Git commands like `git add` and `git commit` were used after completing each task or making significant progress.
- Commits were also made whenever new libraries or packages were installed.
- Commit messages were descriptive and provided a clear explanation of the changes made.

### Server/Front-end Separation

- The front end of the application is built using the Angular framework.
- The server is located in the root folder of the Angular project `Team Yaaper`, ensuring both the front end and server have their own dependencies.
- Communication between the front end and server is handled through `server.js`, which specifies the allowed and denied routes and connects the server to the route files.

## Data Structures

### Client-Side Data Structures

The Users entity has the following properties. These properties are set for user account creation when the user signs up. The roles and groups properties are initially created as empty arrays and dictionaries. These need to be updated when the user is approved by the super user (web moderator) or the admin user (group creator). The roles array contains the 'super' property, which defines the super user account. The Super user has control over all other entities such as Users, Groups, Channels and Messages.


#### User

```typescript
interface User {
  id: string | number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  roles: string[];
  groups: { [key: string]: string[] };
}

```

The Group Entity provides a space for users to interact with each other. A user can create a group and becomes its admin. The group can be deleted and can have multiple admins and users.

#### Group

```typescript
interface  Group{
  id: string;
  name: string;
  description: string;
  admins: string[];
  users: string[];
  channels: Channel[];
}
```
The channel entity is created within the group entity. Admins can create multiple channels, and their permission is required to grant access to each channel. Each channel can have multiple users interacting with one another.

```typescript
interface Channel {
  id: string;
  name: string;
  description: string;
  messages: Message[];
  users: string[];
}
```
The Message entity contains the name of the person who posted it, along with the date and time of the message. This message can be added to the Channel, and it can be edited or deleted by the user.

```typescript
interface Message {
  name: string;
  text: string;
  timestamp: Date;
}
```
The Message entity contains the name of the person who posted it, along with the date and time of the message. This message can be added to the Channel, and it can be edited or deleted by the user.

##
### Server-Side Data Structures

The server-side Data structure looks the same with Client-side data structure except it is more streamlined and compact. An additional data structure which is the Auth.json file is added.

The Auth.json file contains the username and password of the users. User logins are verified using this data structure to either permit or deny a login request. When a user is created by the super user this is the file that is being updated to allow the user to login on the application.

##
### Auth.json

- **username**: The username of the user.
- **password**: The password of the user.

The Users.json file is the main data structure that holds a user's details on the server. When the user is created by the super user, the details are initially set to undefined or left blank, and it's up to the user to fill them in when they log in.

##
### Users.json

- **id**: Unique identifier for the user.
- **username**: The user's username for login.
- **firstname**: The first name of the user.
- **lastname**: The last name of the user.
- **email**: The user's email address.
- **groups**: A dictionary where keys represent group names, and values are lists of roles assigned within those groups.
  - **group1**: "admin" role.
  - **group2**: "user" role.
- **roles**: A list of roles assigned to the user, such as "super".

The GroupsDB.json file contains all the information regarding the groups, such as the channels, messages, users, and admins of the group. When a group is created, the creator is automatically assigned as the admin of the group, and a unique ID is generated for the group.

##
### Groups

- **groups**: A list of groups where each group contains detailed information about its members, channels, and activities.
  - **id**: Unique identifier for the group.
  - **name**: Name of the group.
  - **description**: Brief description of the group’s purpose.
  - **admins**: List of usernames who have admin privileges in the group.
  - **users**: List of all usernames who are members of the group.
  - **channels**: A list of channels within the group.
    - **id**: Unique identifier for the channel.
    - **name**: Name of the channel.
    - **description**: Brief description of the channel’s purpose.
    - **messages**: A list of messages posted in the channel.
      - **name**: Username of the message sender.
      - **text**: Content of the message.
      - **timestamp**: Time when the message was posted (in ISO 8601 format).
    - **users**: List of usernames who are members of the channel.

## Angular Architecture

### Pages

- **home**: This serves as the main page where the users can use the web application. It contains several components that interact with the users dynamically. It displays the groups, channels, and messages for the application.

- **login-page**: This serves as a container page for the login of the user. It also has a planned functionality to swap with the sign-up component to allow users to sign up for the web application Team Yaaper.

- **account**: This page allows the users to view their details and edit their details. It can also show the list of user groups. There is a planned functionality to allow the user to delete themselves.

- **welcome**: This is the page that welcomes the user when they first browse through the site. It acts as the landing page for all users.

- **dashboard**: This page is for the super users - it only shows up if the user has a role of super user. This enables the super user to add and delete users, upgrade users to super user status, add groups, add users to become admins, and add users to groups.

### Components

- **Header**: Shows the Logo and the Navigation of the project. Placed on top of all the pages.

- **Footer**: Displays additional information for the user about the website. Placed at the bottom of all the pages.

- **modal**: This is a reusable component set up to allow usage in different scenarios. This is placed on the components that use a custom modal.

- **side-nav**: This is the navigation that allows users to create a group and view an existing group on the home page. It also emits the group selected to the content component.

- **Content**: This component displays the groups, channels, and messages, and the view will vary based on the user's role. Functionalities also include adding channels and messages, adding users to groups and channels, deleting channels, and deleting the group.

- **login**: This component is the default component shown on the login-page. It allows the user to login to the web application.

- **sign-up**: This component replaces the login component when triggered. It allows the users to sign up for the web application.


### Services

- **`AuthService`**:  
  Creates the login observable for the user, containing both login and logout functions to help authenticate the user.

- **`GroupService`**:  
  Currently, it only handles the loading of the users from the session storage. It can be called in other components to ensure consistent return values at all times.

### Models

The models describe the data structures for both the client side and the server side. The model file is named "dataInterface" as it holds interfaces for the project.

### Routes

- **/authRoute**  
  The system accepts a username and password on the login page. It then reads the `auth.json` file to check if the provided username and password are included in the database. If they are found, the system will respond by accessing the user data in the database and returning the corresponding user information as a response. If the user is not found, it will return false.

- **/loginRoute**  
  The function accepts a user object with a required `id` and `username`. It then reads the user database. If there is an error, it returns an error message. If no `object.id` is sent in the request, it returns the full array of users as a response. If an `id` is included, it finds the index. If no matches are found, it adds the object to the database; otherwise, it updates the user in the database. When successful, it returns true and a success message.

- **/saveUserRoute**  
  The system accepts a request containing a username, password, and a `newUser` tag. If the `newUser` tag is present, the system reads the users array and checks for a matching username. If a match is found, it returns an error. If no match is found, it adds the username and password to the database for use as login authentication by the user. It then returns a response of true along with a relevant message.

- **/delUserRoute**  
  The system takes a username as input and then checks the user database to see if the username exists. If the username is not found, it returns a "not found" message.

  If the username is found, it removes the username from the user database and then updates the user database file. After that, it checks the authentication database to see if the username is listed there. If the username is found in the authentication database, it removes the data associated with the username and updates the `auth.json` file. The system returns an "OK" response if the process is successful, along with a message.

- **/groupRoute**  
  The function accepts a request body and parses the data. If there is no `request.body.id`, it returns all the groups as a response. If there is an `id` in the request, it formulates the group object, checks if the `id` is found. If found, it updates that group object; otherwise, it pushes the object at the end of the array. Finally, it sends back the groups as a response.

- **/delGroupRoute**  
  It accepts an object with an ID in the request and reads the `groupDB` file. Then, it parses the request body and checks the group index to see if the group is in the database. If the group is found, it splices the index and writes it back accordingly to the `groupDB.json`.

### Files

- **`server.js`**:  
  The main entry point of the server application. This file initializes the server, sets up middleware, and defines the base configuration for the server. It listens for incoming HTTP requests and routes them to the appropriate handler based on the defined routes. The `server.js` file is responsible for establishing the server environment, managing server-level configurations, and starting the server to listen on a specified port.

- **`authRoute.js`**:  
  Manages user authentication routes. This file contains the logic for handling authentication-related requests, such as logging in users and verifying credentials. It interacts with the `auth.json` file to check if the provided username and password match any existing records in the database. If a match is found, the route returns the corresponding user data; otherwise, it returns an error message indicating failed authentication.

- **`delGroupRoute.js`**:  
  Handles the deletion of groups from the system. This route processes requests to delete a group based on the provided group ID. It checks if the specified group exists in the `groupDB.json` file. If found, the group is removed, and the database is updated to reflect this change. The route ensures that all associated data, such as users and channels within the group, are correctly managed upon deletion.

- **`delUserRoute.js`**:  
  Manages the deletion of user accounts. This file contains the logic for removing a user from both the user database and the authentication database. It checks for the existence of the user in the database using the provided username. If the user is found, the file deletes the user data from the user database and updates the `auth.json` file to ensure the user can no longer log in. It returns appropriate messages based on the success or failure of these operations.

- **`groupRoute.js`**:  
  Handles requests related to group management, such as creating, updating, and retrieving group information. This route accepts various requests that include data about groups, such as group ID, name, description, and members. It processes these requests by either returning the full list of groups or performing updates to existing group data based on the provided information. This route plays a crucial role in managing group dynamics within the application.

- **`loginRoute.js`**:  
  Processes user login requests and manages user session data. This route handles the retrieval of user data based on the login credentials provided by the user. It checks the user database for matching credentials and either returns the user information or an error if the login attempt is unsuccessful. It ensures that users can access their accounts securely and reliably.

- **`saveUserRoute.js`**:  
  Manages the creation and updating of user accounts. This file contains the logic for adding new users to the database and updating existing user information. When a new user registers, this route validates the user data and ensures it does not conflict with existing records. If the user data is valid, it adds the new user to the user database and updates the authentication database to allow the user to log in.

### Global Variables

- **`BACKEND_URL`**:  
  Holds the root URL of the project, which is used throughout the server and client applications to define the base endpoint for API requests and server interactions. This variable ensures that all parts of the application consistently reference the correct server location.

- **`httpOptions`**:  
  Holds the HTTP headers for the project, including content types, authorization tokens, and other necessary headers for secure and formatted HTTP requests. These headers are used by the client application to communicate with the server, ensuring that all requests are properly formatted and authorized.


## Installation

```bash
git clone https://github.com/sajonasJ/TeamYaaper.git
cd TeamYaaper
npm install
```

```bash
cd server
node server
```
localhost:3000
```bash
cd TeamYaaper
ng serve --open
```
localhost:4200

## Additional Libraries Used

- **[ngx-toastr](https://www.npmjs.com/package/ngx-toastr)**: A library for displaying toast notifications in Angular applications.

- **[Bootstrap](https://getbootstrap.com/)**: A popular front-end framework for developing responsive and mobile-first web applications.

- **[Bootstrap Icons](https://icons.getbootstrap.com/)**: A comprehensive set of icons designed by Bootstrap. 

- **[Google Material Icons](https://fonts.google.com/icons)**: A collection of material design icons provided by Google. 

- **GitHub CLI**: A command-line interface for GitHub, allowing developers to manage their GitHub repositories, issues, pull requests, and more directly from the terminal. 

- **Angular CLI**: The Angular Command Line Interface (CLI) is a tool to initialize, develop, scaffold, and maintain Angular applications.

---

**Created by:** Jonas Sajonas

