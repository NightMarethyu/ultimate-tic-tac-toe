# Ultimate Tic-Tac-Toe

A full-stack Ultimate Tic-Tac-Toe game built with the MERN stack (MongoDB, Express, React, Node.js) and containerized using Docker. This project demonstrates modern web development practices and serves as a portfolio piece.

## What is Ultimate Tic-Tac-Toe

Ultimate Tic-Tac-Toe is a strategic twist on the classic game, played on a 3×3 grid of smaller tic-tac-toe boards (making a total of 9 mini-boards). Players take turns placing X's and O's, but each move determines which mini-board the next player must play in. To win, a player must claim three mini-boards in a row on the larger grid by winning individual mini-games. If a move sends a player to a full or already-won board, they may play anywhere. The game ends when a player wins the large board or all moves are exhausted, resulting in a draw

## Features

- Play Ultimate Tic-Tac-Toe against friends or locally
- Real-time multiplayer support
- User authentication and profiles
- Game history and leaderboards
- Responsive UI built with React
- RESTful API with Express and Node.js
- Persistent data storage with MongoDB
- Fully containerized with Docker for easy deployment

## Getting Started

### Prerequisites

- [Git](https://git-scm.com/downloads)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/) Necessary for certain Linux systems, should already be included in Windows and MacOS Docker Desktop installations

### Installation

1. Clone the repository:

```bash
git clone https://github.com/NightMarethyu/ultimate-tic-tac-toe.git
cd ultimate-tic-tac-toe
```

2. Copy and configure environment variables:

```bash
cp .env.example .env
# Edit .env as needed (default values should work for standard setup)
```

3. Build and run with Docker:

```bash
docker-compose up --build
```

4. The app should now be running at `http://localhost:3000`

**Note**: The application runs inside Docker containers, so you don't need to install Node.js or MongoDB locally.

To stop the application, run:

```bash
docker-compose down
```

## Project Structure

```
/frontend      # React frontend
/backend       # Express/Node backend
```

## Usage

- Register or log in to start playing.
- Invite friends or play locally.
- View your stats and game history.

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE)

---

_Fill in specific details such as repo URL, environment variables, and features as needed._
