<?php

require_once __DIR__ . '/curl.php';

function test_classifications() {
    $url = 'http://127.0.0.1/wp-config/';
    $expected_classification = 'config-grabber';
    
    $response = get($url);
    
    if (strpos($response["body"], 'block') !== false) {
        echo "Test cannot be performed, because IP is blocked.\n";
    } elseif ($response["headers"]["X-THMSEC-CLASS"] === $expected_classification) {
        echo "Classification Test config-grabber passed";
    } else {
        echo "Classification Test config-grabber failed";
    }


    $url = 'http://127.0.0.1/xmlrpc.php';
    $expected_classification = 'xmlrpc-access';
    
    $response = get($url);
    
    if (strpos($response["body"], 'block') !== false) {
        echo "Test cannot be performed, because IP is blocked.\n";
    } elseif ($response["headers"]["X-THMSEC-CLASS"] === $expected_classification) {
        echo "Classification Test xmlrpc-access passed\n";
    } else {
        echo "Classification Test xmlrpc-access failed\n";
    }
    
    $url = 'http://127.0.0.1/wp-admin/';
    $expected_classification = 'admin-access';
    
    $response = get($url);
    
    if (strpos($response["body"], 'block') !== false) {
        echo "Test cannot be performed, because IP is blocked.\n";
    } elseif ($response["headers"]["X-THMSEC-CLASS"] === $expected_classification) {
        echo "Classification Test admin-access passed\n";
    } else {
        echo "Classification Test admin-access failed\n";
    }
    
    $url = 'http://127.0.0.1/wp-content/x';
    $expected_classification = 'wp-content access';
    
    $response = get($url);
    
    if (strpos($response["body"], 'block') !== false) {
        echo "Test cannot be performed, because IP is blocked.\n";
    } elseif ($response["headers"]["X-THMSEC-CLASS"] === $expected_classification) {
        echo "Classification Test wp-content access passed\n";
    } else {
        echo "Classification Test wp-content access failed\n";
    }
    
    $url = 'http://127.0.0.1/wp-config.sql';
    $expected_classification = 'database-access';
    
    $response = get($url);
    
    if (strpos($response["body"], 'block') !== false) {
        echo "Test cannot be performed, because IP is blocked.\n";
    } elseif ($response["headers"]["X-THMSEC-CLASS"] === $expected_classification) {
        echo "Classification Test database-access passed\n";
    } else {
        echo "Classification Test database-access failed\n";
    }
    
    $url = 'http://127.0.0.1/?author';
    $expected_classification = 'author-access';
    
    $response = get($url);
    
    if (strpos($response["body"], 'block') !== false) {
        echo "Test cannot be performed, because IP is blocked.\n";
    } elseif ($response["headers"]["X-THMSEC-CLASS"] === $expected_classification) {
        echo "Classification Test author-access passed\n";
    } else {
        echo "Classification Test author-access failed\n";
    }
    
    $url = 'http://127.0.0.1/searchreplacedb2.php';
    $expected_classification = 'suspicious-file-access';
    
    $response = get($url);
    
    if (strpos($response["body"], 'block') !== false) {
        echo "Test cannot be performed, because IP is blocked.\n";
    } elseif ($response["headers"]["X-THMSEC-CLASS"] === $expected_classification) {
        echo "Classification Test suspicious-file-access passed\n";
    } else {
        echo "Classification Test suspicious-file-access failed\n";
    }
    
    $url = 'http://127.0.0.1/installer-log.txt';
    $expected_classification = 'suspicious-file-access';
    
    $response = get($url);
    
    if (strpos($response["body"], 'block') !== false) {
        echo "Test cannot be performed, because IP is blocked.\n";
    } elseif ($response["headers"]["X-THMSEC-CLASS"] === $expected_classification) {
        echo "Classification Test suspicious-file-access passed\n";
    } else {
        echo "Classification Test suspicious-file-access failed\n";
    }
    
    $url = 'http://127.0.0.1/emergency.php';
    $expected_classification = 'suspicious-file-access';
    
    $response = get($url);
    
    if (strpos($response["body"], 'block') !== false) {
        echo "Test cannot be performed, because IP is blocked.\n";
    } elseif ($response["headers"]["X-THMSEC-CLASS"] === $expected_classification) {
        echo "Classification Test suspicious-file-access passed\n";
    } else {
        echo "Classification Test suspicious-file-access failed\n";
    }
    
    $url = 'http://127.0.0.1/feed';
    $expected_classification = 'suspicious-file-access';
    
    $response = get($url);
    
    if (strpos($response["body"], 'block') !== false) {
        echo "Test cannot be performed, because IP is blocked.\n";
    } elseif ($response["headers"]["X-THMSEC-CLASS"] === $expected_classification) {
        echo "Classification Test suspicious-file-access passed\n";
    } else {
        echo "Classification Test suspicious-file-access failed\n";
    }
    
    $url = 'http://127.0.0.1/comments/feed';
    $expected_classification = 'suspicious-file-access';
    
    $response = get($url);
    
    if (strpos($response["body"], 'block') !== false) {
        echo "Test cannot be performed, because IP is blocked.\n";
    } elseif ($response["headers"]["X-THMSEC-CLASS"] === $expected_classification) {
        echo "Classification Test suspicious-file-access passed\n";
    } else {
        echo "Classification Test suspicious-file-access failed\n";
    }
    
    $url = 'http://127.0.0.1/7f5dcd0.html';
    $expected_classification = 'suspicious-file-access';
    
    $response = get($url);
    
    if (strpos($response["body"], 'block') !== false) {
        echo "Test cannot be performed, because IP is blocked.\n";
    } elseif ($response["headers"]["X-THMSEC-CLASS"] === $expected_classification) {
        echo "Classification Test suspicious-file-access passed\n";
    } else {
        echo "Classification Test suspicious-file-access failed\n";
    }
    
    $url = 'http://127.0.0.1/backup';
    $expected_classification = 'suspicious-file-access';
    
    $response = get($url);
    
    if (strpos($response["body"], 'block') !== false) {
        echo "Test cannot be performed, because IP is blocked.\n";
    } elseif ($response["headers"]["X-THMSEC-CLASS"] === $expected_classification) {
        echo "Classification Test suspicious-file-access passed\n";
    } else {
        echo "Classification Test suspicious-file-access failed\n";
    }
    
    $url = 'http://127.0.0.1/fantastico_fileslist.txt';
    $expected_classification = 'suspicious-file-access';
    
    $response = get($url);
    
    if (strpos($response["body"], 'block') !== false) {
        echo "Test cannot be performed, because IP is blocked.\n";
    } elseif ($response["headers"]["X-THMSEC-CLASS"] === $expected_classification) {
        echo "Classification Test suspicious-file-access passed\n";
    } else {
        echo "Classification Test suspicious-file-access failed\n";
    }
    
    $url = 'http://127.0.0.1/?attachment_id';
    $expected_classification = 'suspicious-file-access';
    
    $response = get($url);
    
    if (strpos($response["body"], 'block') !== false) {
        echo "Test cannot be performed, because IP is blocked.\n";
    } elseif ($response["headers"]["X-THMSEC-CLASS"] === $expected_classification) {
        echo "Classification Test suspicious-file-access passed\n";
    } else {
        echo "Classification Test suspicious-file-access failed\n";
    }
    
    $url = 'http://127.0.0.1/wp-json/oembed';
    $expected_classification = 'suspicious-file-access';
    
    $response = get($url);
    
    if (strpos($response["body"], 'block') !== false) {
        echo "Test cannot be performed, because IP is blocked.\n";
    } elseif ($response["headers"]["X-THMSEC-CLASS"] === $expected_classification) {
        echo "Classification Test suspicious-file-access passed\n";
    } else {
        echo "Classification Test suspicious-file-access failed\n";
    }
    
    $url = 'http://127.0.0.1/wp-sitemap-users-1.xml';
    $expected_classification = 'suspicious-file-access';
    
    $response = get($url);
    
    if (strpos($response["body"], 'block') !== false) {
        echo "Test cannot be performed, because IP is blocked.\n";
    } elseif ($response["headers"]["X-THMSEC-CLASS"] === $expected_classification) {
        echo "Classification Test suspicious-file-access passed\n";
    } else {
        echo "Classification Test suspicious-file-access failed\n";
    }
    
    $url = 'http://127.0.0.1/author-sitemap.xml';
    $expected_classification = 'suspicious-file-access';
    
    $response = get($url);
    
    if (strpos($response["body"], 'block') !== false) {
        echo "Test cannot be performed, because IP is blocked.\n";
    } elseif ($response["headers"]["X-THMSEC-CLASS"] === $expected_classification) {
        echo "Classification Test suspicious-file-access passed\n";
    } else {
        echo "Classification Test suspicious-file-access failed\n";
    }
}

function send_blacklisted_requests_to_check_if_ip_gets_blocked() {
    $url = 'http://127.0.0.1/wp-content/bad-request.php';
    $num_requests = 21;

    for ($i = 0; $i < $num_requests; $i++) {
        $response = get($url);
        
        if (strpos($response["body"], 'block') !== false) {
            echo "Block Test passed.\n";
            return;
        }
    }

    echo "Block Test failed.\n";
}

//send_blacklisted_requests_to_check_if_ip_gets_blocked();
test_classifications();