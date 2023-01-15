# Movie Collaboration Graph
# About the Project
The Movie Collaboration Graph is a web application with an interactive network graph depicting the collaborations between actors. Actors are connected if they have worked together on a movie. Users can hover, click, and search nodes for collaboration details. 

The web app uses ReactJS for the frontend and NodeJS for the backend.

# Development Specifics
We used node.js for data retrieval along with an external API in the form of themoviedb API for retrieving around the top 1200-rated movies. We retrieved the top 3 actors from each movie and if the actors exceeded a certain popularity threshold they were added as nodes to graph. Nodes were ensured to be unique and the Python NetworkX graph library was used for data parsing and graph construction. The Gephi software was used for improved graph visualization, node placement, and dynamic node sizing. Edges were drawn depending on if the actors were both part of one of the identified top-rated movies. Sigma.js was used for the web-based rendering of the actor-network graph. React methodology was then used for event handling of hovering and clicking events pertaining to nodes to then show the user important collaboration information. We added a search bar and developed collaboration details of nodes alongside the application logo.

# Installation
Our frontend is dependent upon ReactJS and its libraries. Therefore, you will need to install npm and run the following commands once you have cloned the repository and navigated to the web-app directory. Our backend is dependent upon NodeJS and some of its libraries. Click this link for more information on how to install npm. Once you have npm installed, go to the web-app directory and run the following command:

npm install
Once all dependencies are installed, run the following command to start both the server and front end locally:

npm start
We use concurrently to build and run both the client and the server using a single command (npm start). For more information about the commands that run under the hood, check out the package.json file under scripts.

Open http://localhost:3000 to view it in your browser.

