# WB MVP Project

This project is a service that integrates with the Wildberries API to manage and export tariff data into Google Sheets on a scheduled basis. The service is built using Node.js, with a PostgreSQL database and includes a cron job to regularly update the data.

## Table of Contents
1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Installation](#installation)
4. [Environment Variables](#environment-variables)
5. [Running the Application](#running-the-application)
6. [Scheduling Cron Jobs](#scheduling-cron-jobs)
7. [Usage](#usage)
8. [Contributing](#contributing)

---

### Features

- **Wildberries Tariff Data**: Fetches tariff data from the Wildberries API.
- **Google Sheets Export**: Exports data to a Google Sheets document daily.
- **Automated Scheduling**: Uses cron jobs to perform daily data updates.
- **Database**: Stores warehouse and tariff data in a PostgreSQL database.
  
### Tech Stack

- **Node.js** - Server runtime
- **Express** - Web server framework
- **PostgreSQL** - Database for data persistence
- **Google Sheets API** - For exporting data to Google Sheets
- **node-cron** - For scheduling tasks

### Installation

1. **Clone the Repository**:

    ```bash
    git clone https://github.com/reseldor/wb-mvp.git
    cd wb-mvp
    ```

2. **Install Dependencies**:

    ```bash
    npm i
    ```

3. **Setup PostgreSQL Database**:
   - Ensure PostgreSQL is installed and running.
   - Create a new database, e.g., for example with name `wb_mvp_db`.
   - Run any database migrations if required to set up the schema.

4. **Google Service Account Setup**:
   - Create a Google Cloud project and enable the Google Sheets API.
   - Generate a service account and download the (for example file name changed on `secrets.json`) file, which should be placed in the root of the project.

### Environment Variables

Create a `.env` file in the root of your project with the following variables:

```plaintext
APP_PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=wb_mvp_db
GOOGLE_APPLICATION_CREDENTIALS=./secrets.json
```

### Running the Application

**Start the server with**:

 ```bash
 npm run dev
 ```

The server should now be running on the port specified in .env.

### Scheduling Cron Jobs

A cron job is scheduled to fetch and update tariff data every day (for example at 10:50 AM Moscow time). The job runs automatically when the server starts.

### Usage

The service provides an endpoint to fetch data and export it to Google Sheets automatically. To modify settings or add more sheets, update the configuration accordingly.

### Contributing

1. **Fork** the repository.
2. **Create** a new branch for your feature (```git checkout -b feature-name```).
3. **Commit** your changes (```git commit -m 'Add new feature'```).
4. **Push** to the branch (```git push origin feature-name```).
5. Open a **Pull Request**.
