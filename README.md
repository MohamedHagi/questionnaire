# Questionnaire App

This repository contains a questionnaire app built with React for the client-side and Node.js/Express for the server-side mock API. The app allows users to submit responses to a set of questions and retrieve the stored responses.

## Folder Structure

The repository is organized into two main folders:

- **client**: This folder contains the React app, responsible for rendering the questionnaire form and displaying the responses. It utilizes modern JavaScript and React best practices.
- **server**: This folder contains the Node.js/Express mock API, responsible for handling the requests from the client-side app. It provides endpoints to add new responses and retrieve existing responses.

## Getting Started

To get started with the questionnaire app, follow the steps below:

### Prerequisites

Make sure you have the following installed on your machine:

- Node.js (version 12 or higher)
- npm (Node Package Manager)

### Installation

1. Clone the repository to your local machine using Git or download the ZIP file and extract it.

```bash
git clone https://github.com/MohamedHagi/questionnaire.git
```

2. Navigate to the project root folder.

```bash
cd questionnaire
```

3. Install the dependencies for both the client and server.

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

4. Start the development server for both the client and server.

```bash
# Start the client development server
cd ../client
npm start

# Start the server
cd ../server
npm start
```

5. The client-side app will be accessible at `http://localhost:3000`, and the server-side mock API will be running at `http://localhost:3001`.

## Usage

Once the app is running, you can access the questionnaire form in your browser by visiting `http://localhost:3000`. You can then answer the questions and submit your response. The app will store the response, and you can view all the stored responses by visiting `http://localhost:3001/api/responses` in your browser or making a GET request to the same URL.


