Nimiris Airlines - Flight Management System
Overview

Nimiris Airlines is a comprehensive, full-stack flight management and ticketing platform. It uses a multi-role architecture designed to serve passengers, airline management, and airport ground staff. The application handles dynamic flight creation, multi-tenant airline data isolation, ticket reservations, and manual payment validation workflows.
Features
Passenger Portal

    Flight search and browsing.

    Ticket reservation system with seat class selection (Economy, Business, First Class).

    Multiple payment options (Card for instant validation, Cash for on-site terminal payment).

Airline Staff Dashboard (Management)

    Secure, role-based access requiring specific airline authorization codes.

    Multi-tenant data isolation (staff members only manage flights for their designated airline).

    Create, update, and delete scheduled flights.

    Automated dynamic price suggestions based on route and aircraft model.

    Automatic seat availability calculation tied to specific aircraft capacities.

Airport Staff Dashboard (Terminal Cashier)

    Dedicated login portal for airport ground staff.

    Real-time passenger manifest and payment status tracking.

    One-click manual validation for passengers paying with cash at the terminal counter.

Tech Stack
Frontend

    React.js (Vite)

    React Router DOM (Protected routes and role-based navigation)

    Tailwind CSS (Styling and responsive design)

Backend

    Java Spring Boot

    Spring Data JPA / Hibernate

    RESTful API architecture

Database

    MySQL

Prerequisites

    Node.js and npm

    Java Development Kit (JDK) 17 or higher

    MySQL Server (Running locally or hosted)

Installation and Setup
Backend Setup

    Clone the repository to your local machine.

    Navigate to the backend project directory.

    Open src/main/resources/application.properties and configure your database credentials:
    Properties

    spring.datasource.url=jdbc:mysql://localhost:3306/your_database_name
    spring.datasource.username=your_username
    spring.datasource.password=your_password
    spring.jpa.hibernate.ddl-auto=update

    Run the Spring Boot application using your IDE or Maven wrapper. The server will default to port 8080.

Frontend Setup

    Open a new terminal and navigate to the frontend directory.

    Install the required Node dependencies:
    Bash

    npm install

    Start the Vite development server:
    Bash

    npm run dev

    The application will be accessible at http://localhost:5173.

Architecture Notes

    CORS: Cross-Origin Resource Sharing is configured globally in the Spring Boot backend to permit requests from the React frontend port.

    Authentication: The frontend utilizes localStorage to manage session states, airline IDs, and role-based access control (RBAC) to protect the administrative dashboards.

    Data Transfer Objects (DTOs): The backend utilizes specific Request classes to securely parse JSON payloads and avoid null-mapping errors with primitive data types.
