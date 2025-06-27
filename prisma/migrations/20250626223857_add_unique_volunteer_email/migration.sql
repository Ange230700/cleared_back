-- CreateTable
CREATE TABLE `collection` (
    `collection_id` BIGINT NOT NULL AUTO_INCREMENT,
    `collection_date` DATE NOT NULL,
    `collection_place` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`collection_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `garbage` (
    `garbage_id` BIGINT NOT NULL AUTO_INCREMENT,
    `collection_id` BIGINT NULL,
    `garbage_type` VARCHAR(255) NOT NULL,
    `quantity_kg` DOUBLE NOT NULL,

    INDEX `garbage_collection_id_foreign`(`collection_id`),
    PRIMARY KEY (`garbage_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `volunteer` (
    `volunteer_id` BIGINT NOT NULL AUTO_INCREMENT,
    `volunteer_name` VARCHAR(255) NOT NULL,
    `volunteer_email` VARCHAR(255) NOT NULL,
    `password` TEXT NOT NULL,
    `role` ENUM('admin', 'attendee') NOT NULL DEFAULT 'attendee',

    UNIQUE INDEX `volunteer_volunteer_email_key`(`volunteer_email`),
    PRIMARY KEY (`volunteer_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `volunteer_collection` (
    `volunteer_collection_id` BIGINT NOT NULL AUTO_INCREMENT,
    `volunteer_id` BIGINT NULL,
    `collection_id` BIGINT NULL,

    INDEX `volunteer_collection_collection_id_foreign`(`collection_id`),
    INDEX `volunteer_collection_volunteer_id_foreign`(`volunteer_id`),
    PRIMARY KEY (`volunteer_collection_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `session` (
    `token_id` VARCHAR(191) NOT NULL,
    `volunteer_id` BIGINT NOT NULL,
    `issued_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expires_at` DATETIME(3) NOT NULL,

    INDEX `session_volunteer_id_idx`(`volunteer_id`),
    INDEX `session_expires_at_idx`(`expires_at`),
    PRIMARY KEY (`token_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `garbage` ADD CONSTRAINT `garbage_collection_id_foreign` FOREIGN KEY (`collection_id`) REFERENCES `collection`(`collection_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `volunteer_collection` ADD CONSTRAINT `volunteer_collection_collection_id_foreign` FOREIGN KEY (`collection_id`) REFERENCES `collection`(`collection_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `volunteer_collection` ADD CONSTRAINT `volunteer_collection_volunteer_id_foreign` FOREIGN KEY (`volunteer_id`) REFERENCES `volunteer`(`volunteer_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `session` ADD CONSTRAINT `session_volunteer_id_fkey` FOREIGN KEY (`volunteer_id`) REFERENCES `volunteer`(`volunteer_id`) ON DELETE CASCADE ON UPDATE CASCADE;
