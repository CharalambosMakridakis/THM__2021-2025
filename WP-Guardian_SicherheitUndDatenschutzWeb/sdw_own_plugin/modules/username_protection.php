<?php

namespace LinusNiko\Own;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

// Filter
add_filter('the_author', ['\LinusNiko\Own\UsernameProtection', 'hide_usernames']);
add_filter('get_the_author_display_name', ['\LinusNiko\Own\UsernameProtection', 'hide_usernames']);
add_filter('get_comment_author', ['\LinusNiko\Own\UsernameProtection', 'hide_usernames']);
add_filter('author_link', ['\LinusNiko\Own\UsernameProtection', 'hide_author_link'], 10, 2);
add_filter('rest_prepare_user', ['\LinusNiko\Own\UsernameProtection', 'hide_usernames_in_rest'], 10, 3);

// Action
add_action('template_redirect', ['\LinusNiko\Own\UsernameProtection', 'redirect_author_pages']);
add_action('admin_notices', ['\LinusNiko\Own\UsernameProtection', 'warn_if_display_name_is_username']);

class UsernameProtection
{

    public static function hide_usernames($display_name)
    {
        $user = get_user_by('login', $display_name);
        if ($user)
        {
            if ($user->nickname && $user->nickname !== $user->user_login)
            {
                return esc_html($user->nickname);
            }
            return esc_html("Ein Nutzer");
        }
        return esc_html("Ein Nutzer");
    }
    
    public static function hide_author_link($link, $author_id)
    {
        return esc_url('#');
    }
    
    public static function hide_usernames_in_rest($response, $user, $request)
    {
        $data = $response->get_data();

        if ($user->nickname && $user->nickname !== $user->user_login)
        {
            $data['name'] = esc_attr($user->nickname);
            $data['slug'] = esc_attr($user->nickname);
        }else{
            $data['name'] = esc_attr("WordpressUser");
            $data['slug'] = esc_attr("WordpressUser");
        }
        
        $data['url'] = esc_url('#');
        $response->set_data($data);
        return $response;
    }
    
    public static function warn_if_display_name_is_username()
    {
        $current_user = wp_get_current_user();
        if ($current_user->user_login === $current_user->nickname)
        {
            echo '<div class="notice notice-warning"><p>';
            echo esc_html('Your display name is the same as your username. This can expose your username publicly, which is a security risk. Please change your display name in your profile settings.');
            echo '</p></div>';
        }
    }
    
    public static function redirect_author_pages()
    {
        if (is_author())
        {
            wp_redirect(home_url());
            exit;
        }
    }
}