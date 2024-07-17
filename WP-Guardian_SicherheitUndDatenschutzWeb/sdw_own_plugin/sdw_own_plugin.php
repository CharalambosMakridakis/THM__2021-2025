<?php
/*
Plugin Name: WP-Guardian
Description: WP-Guardian ist eine moderne Erweiterung für Wordpress, welche Ihre Webseite und die Daten Ihrer Nutzer schützt.
Version: 1.0.0
Author: Linus Richter und Charalambos Makridakis
*/

namespace LinusNiko\Own;

if ( ! defined( 'ABSPATH' ) ) exit;

require_once(dirname(__FILE__) . '/modules/log.php');
require_once(dirname(__FILE__) . '/modules/username_protection.php');

?>