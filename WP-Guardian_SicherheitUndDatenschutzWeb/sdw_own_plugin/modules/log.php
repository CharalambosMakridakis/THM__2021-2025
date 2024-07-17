<?php

namespace LinusNiko\Own;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

require_once(dirname(__FILE__) . '/database.php');
require_once(dirname(__FILE__) . '/classifier.php');

add_action('admin_menu', ['\LinusNiko\Own\Log', 'add_menu']);
add_action('shutdown', ['\LinusNiko\Own\Log', 'log_access']);

/**
 * Log module for the THM Security plugin.
 */
class Log
{
    /**
     * Adds a menu item to the tools menu.
     */
    public static function add_menu()
    {
        add_management_page('THM Security', 'THM Security', 'manage_options', 'thm-security', ['\LinusNiko\Own\Log', 'render_management_page']);
    }

    /**
     * Renders the management page.
     */
    public static function render_management_page()
    {
        if (!current_user_can('manage_options')) return;

        $tab = sanitize_text_field(@$_GET['tab'] ?: '');

        ?>
        <div class="wrap">
            <h1><?= esc_html(get_admin_page_title()) ?></h1>
            <nav class="nav-tab-wrapper">
                <a href="?page=thm-security" class="nav-tab <?= empty($tab) ? 'nav-tab-active' : '' ?>">Access Log</a>
                <a href="?page=thm-security&tab=page2" class="nav-tab <?= ($tab == 'page2') ? 'nav-tab-active' : '' ?>">Banned IPs</a>
            </nav>
            <?php if(empty($tab))    self::render_access_log(); ?>
            <?php if($tab==='page2') self::render_ip_blacklist_log(); ?>
        </div>
        <?php
    }

    /**
     * Renders the access log tab on the management page.
     */
    private static function render_access_log()
    {
        $logs = Database::get_access_log();

        ?>
        <table class="wp-list-table widefat fixed striped table-view-list">
            <thead>
                <tr>
                    <th>Timestamp</th>
                    <th>IP</th>
                    <th>URL</th>
                    <th>CLASSIFICATION</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach($logs as $log): ?>
                    <tr>
                        <td><?= esc_html($log->time) ?></td>
                        <td><?= esc_html($log->client) ?></td>
                        <td><?= esc_html($log->url) ?></td>
                        <td><?= esc_html($log->classification) ?></td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
        <?php
    }

    /**
     * Renders the empty page tab on the management page.
     */
    private static function render_ip_blacklist_log()
    {
        $logs = Database::get_ip_blacklist_log();

        ?>
        <table class="wp-list-table widefat fixed striped table-view-list">
            <thead>
                <tr>
                    <th>Timestamp</th>
                    <th>IP</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach($logs as $log): ?>
                    <tr>
                        <td><?= esc_html($log->time) ?></td>
                        <td><?= esc_html($log->client) ?></td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
        <?php
    }

    /**
     * Logs any access to the website into the database.
     */
    public static function log_access()
    {  
        if(Database::is_ip_blocked($_SERVER['REMOTE_ADDR'])) return;
        Database::append_access_log(
            $_SERVER['REMOTE_ADDR'] ?? '~',
            $_SERVER['REQUEST_URI'] ?? '~',
            Classifier::get_request_class()
        );
    }
}
?>