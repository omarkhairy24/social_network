# Social Network API
This project is a Social Network API built with GraphQL, NestJS, and Sequelize. It includes features for authentication, posts, following users, liking posts, and commenting on posts. DataLoader is used for efficient data fetching.

## Features
### Authentication
    Signup: Create a new user account.
    
    Login: Authenticate an existing user.
    
    Update Password: Change the user's password.
    
    Update User: Modify user details.
    
    Get User: Retrieve user information.

### Post
    Add Post: Create a new post.
    Update Post: Edit an existing post.
    Delete Post: Remove a post.
    View Posts: Retrieve a list of posts.
    View Single Post: Retrieve details of a specific post.
### Follow
    Follow User: Follow another user.
    Unfollow User: Unfollow a user.
### Like
    Add Like: Like a post.
    Remove Like: Unlike a post.
### Comments
    Add Comment: Comment on a post.
    Update Comment: Edit an existing comment.
    Remove Comment: Delete a comment.

## Getting Started
### Prerequisites
    Node.js
    npm
    PostgreSQL
    nest.js
    sequelize
    graphql
## Installation
  ### Clone the repository:
    git clone https://github.com/yourusername/social-network-api.git
    cd social-network-api
  ### Install dependencies:
    npm install
    
  ### Set up environment variables:
    Create a .env file in the root directory and add the following variables:
    DB_NAME = your_database_name
    DB_TYPE = postgres
    host = host
    port = port
    username = your_username
    password = your_password
  ### Run database migrations:
    npx sequelize-cli db:migrate

  ### Running the APIRunning the API
      Start the development server:
        npm run start:dev
      Start the production server:
        npm start


