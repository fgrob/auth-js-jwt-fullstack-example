# Example of Full Stack User Authentication and Permissions System in React and Node JS

This repository contains an example of a full stack application that demonstrates a user authentication system with access permissions functionality. The application allows users to register, log in, and access protected routes based on their assigned roles.

## Technologies Used

- **Frontend**: React and React Router Dom are used to create the user interface and manage navigation between different views.
- **Backend**: Node.js and Express are employed to create the backend server that handles client requests and responses.
- **Database**: PostgreSQL is used to store and manage user information, roles, and permissions.
- **Security**: JWT (JSON Web Token) is implemented for user authentication and authorization. Bcrypt is used for password hashing and security.
- **ORM**: Sequelize is used as an Object-Relational Mapping (ORM) tool to simplify interactions with the database.
- **Headers and CORS**: HTTP headers and CORS are used to ensure secure communication between the frontend and backend.
- **uuidv4**: Utilized to generate unique identifiers for system entities.

## Key Features

- **User Registration**: Users can register by providing information such as a username, password, and other relevant details.
- **Login**: Users can log in using their registered credentials.
- **Authentication and Authorization**: JWT is used to authenticate users, and a role and permission system is implemented to authorize access to protected routes.
- **Protected Routes**: Demonstrates how to define routes that require specific authentication and permissions to access.
- **Role Management**: Users are assigned specific roles, determining the actions and areas of the application they can access.
- **Password Security**: User passwords are securely stored using hashed passwords with Bcrypt.
- **Secure Communication**: Headers and CORS are implemented to ensure secure communication and prevent vulnerabilities.
- **ORM for Database**: Sequelize simplifies interaction with the database, making it easier to create, read, update, and delete records.

## Setup

1. Clone this repository: `git clone <repository URL>`
2. Navigate to the project folder: `cd js-auth-jwt`
3. Install frontend dependencies: `cd client && npm install`
4. Install backend dependencies: `cd server && npm install`
5. Configure the PostgreSQL database and update the configuration in the `server/config/db.config.js` file.
6. Start the backend server: `npm run start` from the `server` folder.
7. Start the frontend application: `npm run dev` from the `client` folder.

## Contribution

If you wish to contribute to this project, feel free to do so through pull requests. You can also report issues and suggest improvements.

## Notes

This project is an example and should not be considered production-ready without further review and security considerations.

---

Enjoy exploring this example of a JavaScript full stack authentication and permissions application! If you have any questions or need further guidance, don't hesitate to contact the repository creator.
