/* Replace with your SQL commands */

CREATE TABLE `retro` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL DEFAULT '',
  `owner_id` int(11) unsigned NOT NULL,
  `owner_name` varchar(255) NOT NULL DEFAULT '',
  `created_at` timestamp NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;


CREATE TABLE `questions` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `question` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;


CREATE TABLE `retro_user_ratings` (
  `retro_id` int(10) unsigned NOT NULL,
  `question_id` int(10) unsigned NOT NULL,
  `user_id` int(11) unsigned NOT NULL,
  `rated_user_id` int(11) unsigned NOT NULL,
  `rating` int(2) unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL,
  `updated_at` timestamp NOT NULL,
  PRIMARY KEY (`retro_id`,`question_id`,`user_id`,`rated_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;