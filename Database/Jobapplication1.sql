DROP DATABASE IF EXISTS job_portal;
CREATE DATABASE job_portal;
USE job_portal;

-- 1. COMPANY Table
CREATE TABLE COMPANY
(
    Company_ID INT AUTO_INCREMENT PRIMARY KEY,
    Company_Name VARCHAR(100) NOT NULL,
    Website VARCHAR(150),
    Headquarters VARCHAR(100)
);

-- 2. DEPARTMENT Table
CREATE TABLE DEPARTMENT
(
    Department_ID INT AUTO_INCREMENT PRIMARY KEY,
    Department_Name VARCHAR(100) NOT NULL,
    Company_ID INT NOT NULL,
    FOREIGN KEY (Company_ID) REFERENCES COMPANY(Company_ID) ON DELETE CASCADE
);

-- 3. RECRUITER Table
CREATE TABLE RECRUITER
(
    Recruiter_ID INT AUTO_INCREMENT PRIMARY KEY,
    Recruiter_Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Phone VARCHAR(20),
    Company_ID INT NOT NULL,
    FOREIGN KEY (Company_ID) REFERENCES COMPANY(Company_ID) ON DELETE CASCADE
);

-- 4. JOB Table
CREATE TABLE JOB
(
    Job_ID INT AUTO_INCREMENT PRIMARY KEY,
    Job_Title VARCHAR(100) NOT NULL,
    Job_Description TEXT,
    Location VARCHAR(100),
    Salary_Range VARCHAR(50),
    Department_ID INT NOT NULL,
    Recruiter_ID INT NOT NULL,
    FOREIGN KEY (Department_ID) REFERENCES DEPARTMENT(Department_ID) ON DELETE CASCADE,
    FOREIGN KEY (Recruiter_ID) REFERENCES RECRUITER(Recruiter_ID) ON DELETE CASCADE
);

-- 5. APPLICANT Table
CREATE TABLE APPLICANT
(
    Applicant_ID INT AUTO_INCREMENT PRIMARY KEY,
    Applicant_Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Phone VARCHAR(20),
    Resume_Link VARCHAR(255)
);

-- 6. APPLICATION Table
CREATE TABLE APPLICATION
(
    Application_ID INT AUTO_INCREMENT PRIMARY KEY,
    Applicant_ID INT NOT NULL,
    Job_ID INT NOT NULL,
    Applied_Date DATE NOT NULL,
    Status ENUM('Applied', 'Interview Scheduled', 'Offered', 'Rejected') DEFAULT 'Applied',
    FOREIGN KEY (Applicant_ID) REFERENCES APPLICANT(Applicant_ID) ON DELETE CASCADE,
    FOREIGN KEY (Job_ID) REFERENCES JOB(Job_ID) ON DELETE CASCADE,
    UNIQUE KEY unique_application (Applicant_ID, Job_ID)
);

-- 7. INTERVIEW Table
CREATE TABLE INTERVIEW
(
    Interview_ID INT AUTO_INCREMENT PRIMARY KEY,
    Application_ID INT NOT NULL,
    Interview_Date DATETIME NOT NULL,
    Mode ENUM('Online', 'In-Person') DEFAULT 'Online',
    Feedback TEXT,
    FOREIGN KEY (Application_ID) REFERENCES APPLICATION(Application_ID) ON DELETE CASCADE
);

-- 8. OFFER Table
CREATE TABLE OFFER
(
    Offer_ID INT AUTO_INCREMENT PRIMARY KEY,
    Application_ID INT UNIQUE NOT NULL,
    Offer_Date DATE NOT NULL,
    Salary_Offered DECIMAL(10, 2) NOT NULL,
    Joining_Date DATE NOT NULL,
    Offer_Status ENUM('Pending', 'Accepted', 'Declined') DEFAULT 'Pending',
    FOREIGN KEY (Application_ID) REFERENCES APPLICATION(Application_ID) ON DELETE CASCADE
);

-- ===================================================
-- SAMPLE DATA INSERTION
-- ===================================================

INSERT INTO COMPANY (Company_Name, Website, Headquarters) VALUES
('Infosys', 'https://www.infosys.com', 'Bengaluru, India'),
('TCS', 'https://www.tcs.com', 'Mumbai, India'),
('Wipro', 'https://www.wipro.com', 'Bengaluru, India');

INSERT INTO DEPARTMENT (Department_Name, Company_ID) VALUES
('Engineering', 1),
('Data Analytics', 1),
('Cloud Infrastructure', 2),
('Security & Networking', 3);

INSERT INTO RECRUITER (Recruiter_Name, Email, Phone, Company_ID) VALUES
('Ananya Sharma', 'ananya.sharma@infosys.com', '9876543210', 1),
('Rajesh Kumar', 'rajesh.kumar@tcs.com', '9876543211', 2),
('Pooja Nair', 'pooja.nair@wipro.com', '9876543212', 3);

INSERT INTO JOB (Job_Title, Job_Description, Location, Salary_Range, Department_ID, Recruiter_ID) VALUES
('Full Stack Developer', 'Develop web services and React frontends using MERN/PERN stack.', 'Bengaluru', '6 - 10 LPA', 1, 1),
('Database Administrator', 'Design schemas, optimize SQL queries, and maintain relational integrity.', 'Bengaluru', '7 - 12 LPA', 2, 1),
('Systems Engineer', 'Deploy and maintain Linux server environments and socket applications.', 'Hyderabad', '5 - 8 LPA', 3, 2),
('Security Analyst', 'Analyze network packet flow and configure access control lists.', 'Pune', '6 - 9 LPA', 4, 3);

-- Reset root password to root123
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root123';
FLUSH PRIVILEGES;