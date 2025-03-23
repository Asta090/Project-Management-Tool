# Project-Management-Tool


# Project Management Tool

## Overview

This is a lightweight Project Management Tool inspired by Trello. It allows users to manage projects efficiently using a Kanban-style board. The application includes user authentication, project creation, task management, and commenting features.

## Features

### Frontend (React)

- User Authentication (Sign-up, Login, Logout)
- Project Dashboard:
  - Create, update, delete projects
  - View a list of projects
- Project Boards:
  - Kanban-style board with at least three stages (To-Do, In-Progress, Completed)
  - Drag-and-drop functionality for moving tasks between stages
  - CRUD operations on tasks
- Comments & Attachments:
  - Users can add comments and upload attachments to each task

### Backend (Node.js or Python)

- RESTful API:
  - JWT-based user authentication
  - CRUD operations for projects, tasks, comments, and file uploads
- Data Validation:
  - Validate inputs for user registration, login, and task creation
- File Uploads:
  - Secure handling of file attachments

### Database (MongoDB)

- Schema Design:
  - Schemas for Users, Projects, Tasks, and Comments
  - Includes timestamps and relations between collections

## Installation

### Prerequisites

- Node.js (if using Node.js backend)
- Python (if using Django or Flask backend)
- MongoDB

### Setup Instructions

#### Backend

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/project-management-tool.git
   cd project-management-tool/backend
   ```
2. Install dependencies:
   ```sh
   npm install  # for Node.js backend
   pip install -r requirements.txt  # for Python backend
   ```
3. Configure environment variables:
   ```sh
   cp .env.example .env
   ```
4. Start the backend server:
   ```sh
   npm start  # for Node.js backend
   python manage.py runserver  # for Django backend
   ```

#### Frontend

1. Navigate to the frontend directory:
   ```sh
   cd ../frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend server:
   ```sh
   npm start
   ```

## Usage

1. Sign up and log in to the application.
2. Create a new project and access the Kanban board.
3. Add, update, and delete tasks within each project.
4. Drag and drop tasks between stages.
5. Comment on tasks and upload attachments.

## Tech Stack

- **Frontend:** React, React-DnD
- **Backend:** Node.js (Express) or Python (Django/Flask)
- **Database:** MongoDB
- **Authentication:** JWT

## Contributing

Feel free to submit issues and pull requests to improve this project.

##

