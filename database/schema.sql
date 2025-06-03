-- database\schema.sql

CREATE TABLE `Volunteer`(
    `volunteer_id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `volunteer_name` VARCHAR(255) NOT NULL,
    `volunteer_email` VARCHAR(255) NOT NULL,
    `password` TEXT NOT NULL,
    `role` ENUM('admin', 'attendee') NOT NULL DEFAULT 'attendee'
);
CREATE TABLE `Collection`(
    `collection_id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `collection_date` DATE NOT NULL,
    `collection_place` VARCHAR(255) NOT NULL
);
CREATE TABLE `Volunteer_Collection`(
    `volunteer_id` BIGINT NULL,
    `collection_id` BIGINT NULL
);
CREATE TABLE `Garbage`(
    `garbage_id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `collection_id` BIGINT NULL,
    `garbage_type` VARCHAR(255) NOT NULL,
    `quantity_kg` FLOAT(53) NOT NULL
);
ALTER TABLE
    `Volunteer_Collection` ADD CONSTRAINT `volunteer_collection_volunteer_id_foreign` FOREIGN KEY(`volunteer_id`) REFERENCES `Volunteer`(`volunteer_id`);
ALTER TABLE
    `Garbage` ADD CONSTRAINT `garbage_collection_id_foreign` FOREIGN KEY(`collection_id`) REFERENCES `Collection`(`collection_id`);
ALTER TABLE
    `Volunteer_Collection` ADD CONSTRAINT `volunteer_collection_collection_id_foreign` FOREIGN KEY(`collection_id`) REFERENCES `Collection`(`collection_id`);