CREATE DATABASE IF NOT EXISTS firsttake;
USE firsttake;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS report;
DROP TABLE IF EXISTS review;
DROP TABLE IF EXISTS interest;
DROP TABLE IF EXISTS project_coadmin;
DROP TABLE IF EXISTS contact_reveal;
DROP TABLE IF EXISTS meet_verification;
DROP TABLE IF EXISTS meet_booking;
DROP TABLE IF EXISTS safe_zone;
DROP TABLE IF EXISTS meet_invite;
DROP TABLE IF EXISTS application;
DROP TABLE IF EXISTS project_role_opening;
DROP TABLE IF EXISTS project_requirement;
DROP TABLE IF EXISTS project;
DROP TABLE IF EXISTS user_role;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;


CREATE TABLE users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    phone_number VARCHAR(20),
    phone_revealed_default BOOLEAN DEFAULT 0,
    bio TEXT,
    profile_photo_url VARCHAR(255),
    account_status ENUM('ACTIVE','SUSPENDED','FLAGGED') DEFAULT 'ACTIVE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE role (
    role_id SMALLINT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(100) UNIQUE
);


CREATE TABLE user_role (
    user_id BIGINT,
    role_id SMALLINT,
    assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (role_id) REFERENCES role(role_id)
);


CREATE TABLE project (
    project_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    owner_user_id BIGINT,
    title VARCHAR(255),
    project_type ENUM('FILM_PROJECT','SCRIPT_CALL','SCENE_STUDY','GEAR_SHOWCASE'),
    genre VARCHAR(100),
    description TEXT,
    status ENUM('DRAFT','OPEN','MEET_PENDING','ACTIVE','COMPLETED','CANCELLED'),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_user_id) REFERENCES users(user_id)
);


CREATE TABLE project_requirement (
    requirement_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT,
    requirement_text TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES project(project_id)
);


CREATE TABLE project_role_opening (
    opening_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT,
    role_id SMALLINT,
    role_title VARCHAR(255),
    role_description TEXT,
    max_applicants SMALLINT DEFAULT 5,
    opening_status ENUM('OPEN','FULL','CLOSED'),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES project(project_id),
    FOREIGN KEY (role_id) REFERENCES role(role_id)
);


CREATE TABLE application (
    application_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    opening_id BIGINT,
    applicant_user_id BIGINT,
    message TEXT,
    status ENUM('APPLIED','REJECTED','INVITED_TO_MEET','WITHDRAWN','ACCEPTED'),
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE (opening_id, applicant_user_id),
    FOREIGN KEY (opening_id) REFERENCES project_role_opening(opening_id),
    FOREIGN KEY (applicant_user_id) REFERENCES users(user_id)
);


CREATE TABLE meet_invite (
    invite_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT UNIQUE,
    inviter_user_id BIGINT,
    invite_status ENUM('SENT','DECLINED','ACCEPTED','EXPIRED'),
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    responded_at DATETIME,
    FOREIGN KEY (application_id) REFERENCES application(application_id),
    FOREIGN KEY (inviter_user_id) REFERENCES users(user_id)
);


CREATE TABLE safe_zone (
    safe_zone_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    address VARCHAR(255),
    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),
    zone_type ENUM('LIBRARY','CAFE','CAMPUS','CITY_CENTRE','OTHER'),
    is_active BOOLEAN DEFAULT TRUE
);


CREATE TABLE meet_booking (
    booking_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invite_id BIGINT,
    safe_zone_id BIGINT,
    scheduled_time DATETIME,
    booking_status ENUM('PROPOSED','CONFIRMED','CANCELLED','NO_SHOW'),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invite_id) REFERENCES meet_invite(invite_id),
    FOREIGN KEY (safe_zone_id) REFERENCES safe_zone(safe_zone_id)
);


CREATE TABLE meet_verification (
    verification_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT,
    user_id BIGINT,
    verified BOOLEAN,
    verified_at DATETIME,
    UNIQUE (booking_id, user_id),
    FOREIGN KEY (booking_id) REFERENCES meet_booking(booking_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);


CREATE TABLE contact_reveal (
    reveal_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT UNIQUE,
    contacts_revealed BOOLEAN,
    revealed_at DATETIME,
    FOREIGN KEY (booking_id) REFERENCES meet_booking(booking_id)
);


CREATE TABLE project_coadmin (
    project_id BIGINT,
    user_id BIGINT,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (project_id, user_id),
    FOREIGN KEY (project_id) REFERENCES project(project_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);


CREATE TABLE interest (
    interest_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT,
    interested_user_id BIGINT,
    interest_status ENUM('INTERESTED','WITHDRAWN'),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (project_id, interested_user_id),
    FOREIGN KEY (project_id) REFERENCES project(project_id),
    FOREIGN KEY (interested_user_id) REFERENCES users(user_id)
);


CREATE TABLE review (
    review_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT,
    reviewer_user_id BIGINT,
    reviewee_user_id BIGINT,
    punctuality_rating TINYINT,
    behavior_rating TINYINT,
    skill_rating TINYINT,
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (project_id, reviewer_user_id, reviewee_user_id),
    FOREIGN KEY (project_id) REFERENCES project(project_id),
    FOREIGN KEY (reviewer_user_id) REFERENCES users(user_id),
    FOREIGN KEY (reviewee_user_id) REFERENCES users(user_id)
);


CREATE TABLE report (
    report_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reporter_user_id BIGINT,
    reported_user_id BIGINT,
    project_id BIGINT,
    reason TEXT,
    status ENUM('OPEN','IN_REVIEW','RESOLVED','DISMISSED'),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    resolved_at DATETIME,
    FOREIGN KEY (reporter_user_id) REFERENCES users(user_id),
    FOREIGN KEY (reported_user_id) REFERENCES users(user_id),
    FOREIGN KEY (project_id) REFERENCES project(project_id)
);

CREATE TABLE users (
  user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255),
  email VARCHAR(255),
  password_hash VARCHAR(255),
  phone_number VARCHAR(20),
  phone_revealed_default BOOLEAN DEFAULT 0,
  bio TEXT,
  profile_photo_url VARCHAR(255),
  account_status ENUM('ACTIVE','SUSPENDED','FLAGGED') DEFAULT 'ACTIVE',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);