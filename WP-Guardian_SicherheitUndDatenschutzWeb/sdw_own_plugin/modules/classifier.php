<?php

namespace LinusNiko\Own;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

add_action('wp_loaded',['LinusNiko\Own\Classifier', 'classify_init'], 1);
add_action('plugins_loaded',['LinusNiko\Own\Classifier', 'is_ip_blocked'], 2);

/**
 * Database module for the THM Security plugin.
 */
class Classifier
{

    private static $request_class;

    public static function classify_init()
    {
        self::$request_class = self::classify_request();

        header("X-THMSEC: ENABLED");
        header("X-THMSEC-CLASS: " . self::$request_class);

        if (self::$request_class != 'normal')
        {
            $count = Database::get_unwanted_requests_count($_SERVER['REMOTE_ADDR'], 24 * 7);
            if($count >= 20 && !Database::is_ip_blocked($_SERVER['REMOTE_ADDR']))
            {
                Database::append_ip_blacklist_log($_SERVER['REMOTE_ADDR']);
                die('Your IP address has been blocked. If you think that this is an error, please contact us.');
            }
            header("X-THMSEC-COUNT: $count");
            header("HTTP/1.1 404 Not Found");
            exit;
        }
    }

    public static function classify_request()
    {
        $uri = $_SERVER['REQUEST_URI'];
        $agent = $_SERVER['HTTP_USER_AGENT'];

        if (strpos($uri, '/xmlrpc.php') !== false) {
            return 'xmlrpc-access';
        }
        if (strpos($uri, '/wp-admin') !== false && !is_user_logged_in()) {
            return 'admin-access';
        }
        if (strpos($uri, 'wp-content') !== false) {
            return 'wp-content access';
        }
        if (strpos($uri, '.sql') !== false || strpos($uri, '.sqlite3') !== false) {
            return 'database-access';
        }
        if (strpos($uri, 'wp-config') !== false) {
            return 'config-grabber';
        }
        if (strpos($uri, '?author') !== false) {
            return 'author-access';
        }        
        if (strpos($uri, 'searchreplacedb2.php') !== false) {
            return 'suspicious-file-access';
        }  
        if (strpos($uri, 'installer-log.txt') !== false) {
            return 'suspicious-file-access';
        }  
        if (strpos($uri, 'emergency.php') !== false) {
            return 'suspicious-file-access';
        }  
        if (strpos($uri, 'feed') !== false) {
            return 'suspicious-file-access';
        }  
        if (strpos($uri, 'comments/feed') !== false) {
            return 'suspicious-file-access';
        }  
        if (strpos($uri, '7f5dcd0.html') !== false) {
            return 'suspicious-file-access';
        }  
        if (strpos($uri, 'backup') !== false) {
            return 'suspicious-file-access';
        }  
        if (strpos($uri, 'fantastico_fileslist.txt') !== false) {
            return 'suspicious-file-access';
        }  
        if (strpos($uri, '?attachment_id') !== false) {
            return 'suspicious-file-access';
        }  
        if (strpos($uri, 'wp-json/oembed') !== false) {
            return 'suspicious-file-access';
        }  
        if (strpos($uri, 'wp-sitemap-users-1.xml') !== false) {
            return 'suspicious-file-access';
        }  
        if (strpos($uri, 'author-sitemap.xml') !== false) {
            return 'suspicious-file-access';
        }

        return 'normal';
    }

    public static function get_request_class()
    {
        return self::$request_class;
    }

    public static function is_ip_blocked()
    {
        if (Database::is_ip_blocked($_SERVER['REMOTE_ADDR']))
        {
            die('Your IP address has been blocked. If you think that this is an error, please contact us.');
        }
    }
    
}