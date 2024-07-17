<?php

require_once __DIR__ . '/curl.php';

//edit Names here
$loginNames = ['niko', 'linus', 'asdasd', 'username'];
restAPIUserTest($loginNames);
websiteUserTest($loginNames);

function restAPIUserTest($loginNames)
{
    //user-api-url
    $url = 'http://127.0.0.1/wp-json/wp/v2/users/?per_page=100&page=1';

    $response = get($url);

    $body = $response['body'];

    $bodyString = json_encode($body);

    $passed = true;

    foreach ($loginNames as $loginName) {
        if (strpos($bodyString, $loginName) !== false) {
            $passed = false;
        }
    }

    if ($passed)
        echo "no unprotected usernames found in Rest-API -> TEST PASSED!\n";
    if (!$passed)
        echo "unprotected usernames found in Rest-API -> TEST FAILED!\n";
}

function websiteUserTest($loginNames)
{
    $websiteURls = [
        'localhost/',
        'localhost/beispiel-seite/',
        'localhost/2024/04/28/hallo-welt',
        'localhost/category/allgemein/',
    ];

    $passed = true;

    foreach ($websiteURls as $website)
    {
        $response = get($website);

        $bodyString = json_encode($response);

        foreach ($loginNames as $loginName) {
            if (strpos($bodyString, $loginName) !== false) {
                $passed = false;
            }
        }
    }

    if ($passed)
        echo "no unprotected usernames found on websites -> TEST PASSED!\n";
    if (!$passed)
        echo "unprotected usernames found on websites -> TEST FAILED!\n";
}



