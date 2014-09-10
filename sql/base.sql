﻿CREATE DATABASE IF NOT EXISTS aom CHARACTER SET utf8;
USE aom;

SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS `roles` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `description` varchar(255) NOT NULL,
  PRIMARY KEY  (`id`),
  UNIQUE KEY `uniq_name` (`name`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

INSERT IGNORE INTO `roles` (`id`, `name`, `description`) VALUES(1, 'login', 'Login privileges, granted after account confirmation');
INSERT IGNORE INTO `roles` (`id`, `name`, `description`) VALUES(2, 'admin', 'Administrative user, has access to everything.');

CREATE TABLE IF NOT EXISTS `roles_users` (
  `user_id` int(10) UNSIGNED NOT NULL,
  `role_id` int(10) UNSIGNED NOT NULL,
  PRIMARY KEY  (`user_id`,`role_id`),
  KEY `fk_role_id` (`role_id`),
  CONSTRAINT `roles_users_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `roles_users_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` varchar(254) NOT NULL,
  `username` varchar(32) NOT NULL DEFAULT '',
  `password` varchar(64) NOT NULL,
  `logins` int(10) UNSIGNED NOT NULL DEFAULT '0',
  `last_login` int(10) UNSIGNED,
  PRIMARY KEY  (`id`),
  UNIQUE KEY `uniq_username` (`username`),
  UNIQUE KEY `uniq_email` (`email`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `user_tokens` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` int(11) UNSIGNED NOT NULL,
  `user_agent` varchar(40) NOT NULL,
  `token` varchar(40) NOT NULL,
  `created` int(10) UNSIGNED NOT NULL,
  `expires` int(10) UNSIGNED NOT NULL,
  PRIMARY KEY  (`id`),
  UNIQUE KEY `uniq_token` (`token`),
  KEY `fk_user_id` (`user_id`),
  KEY `expires` (`expires`),
  CONSTRAINT `user_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `user_profiles` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` int(11) UNSIGNED NOT NULL,
  PRIMARY KEY  (`id`),
  KEY `fk_user_id` (`user_id`),
  CONSTRAINT `user_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `map_regions` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `x` int(11) UNSIGNED NOT NULL,
  `y` int(11) UNSIGNED NOT NULL,
  `name` varchar(32) NOT NULL DEFAULT 'region',
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `map_fields` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `region_id` int(11) UNSIGNED NOT NULL,
  `x` bit(6),
  `y` bit(6),
  PRIMARY KEY  (`id`),
  KEY `fk_region_id` (`region_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

SET FOREIGN_KEY_CHECKS = 1;