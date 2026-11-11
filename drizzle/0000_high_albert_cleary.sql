CREATE TABLE `haff_vault` (
	`id` integer PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`revision` integer NOT NULL,
	`envelope` text NOT NULL,
	`updated_at` integer NOT NULL
);
