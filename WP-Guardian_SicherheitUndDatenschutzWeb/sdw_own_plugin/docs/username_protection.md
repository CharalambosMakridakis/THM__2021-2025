# username_protection.php

## Überblick

Die `username_protection.php`-Datei wurde entwickelt, um die Sicherheit einer WordPress-Installation zu erhöhen. Dazu werden Benutzernamen maskiert. Die Datei erreicht dies, indem sie verschiedene Teile von WordPress, die normalerweise den Anmeldenamen eines Benutzers anzeigen würden, ändert und sie durch entweder einen vom Nutzer selbstdefinierten **Spitznamen**, der nicht gleich dem Benutzernamen ist, oder einen generische Platzhatzer `Ein Nutzer` ersetzt.

### Hauptfunktionen

- Verbirgt Benutzernamen an verschiedenen Stellen.
- Leitet Autorenseiten auf die Startseite um.
- Zeigt eine Admin-Benachrichtigung an, wenn der Anzeigename eines Benutzers mit dem Benutzernamen übereinstimmt.

## Verwendete Hooks

### Filter
<list>
    <ol>
        <li style="font-weight: bold">the_author</li>
            <p>Ruft eine Methode auf, die den angezeigten Namen des Autors ändert.</p>
        <li style="font-weight: bold">get_the_author_display_name</li>
            <p>Ruft eine Methode auf, die den angezeigten Namen des Beitragsautors ändert.</p>
        <li style="font-weight: bold">get_comment_author</li>
            <p>Ruft eine Methode auf, die den Namen des Kommentarautors ändert.</p>
        <li style="font-weight: bold">author_link</li>
            <p>Ruft eine Methode auf, die die URL des Autor-Links ändert.</p>
        <li style="font-weight: bold">rest_prepare_user</li>
            <p>Ruft eine Methode auf, die Benutzerdaten in REST API-Antworten ändert.</p>
    </ol>
</list>

### Aktionen
<list>
    <ol>
        <li style="font-weight: bold">template_redirect</li>
            <p>Ruft eine Methode auf, die Autorenseiten (URL mit `author` Query) auf die Startseite umleitet.</p>
        <li style="font-weight: bold">admin_notices</li>
            <p>Ruft eine Methode auf, die eine Warnung im Admin-Dashboard anzeigt, wenn der Anzeigename eines Benutzers mit dem Benutzernamen übereinstimmt.</p>
</list>

## Methoden

### `hide_usernames($display_name)`
Diese Methode ersetzt den angezeigten Namen durch den Spitznamen des Benutzers, wenn dieser gesetzt und unterschiedlich vom Benutzernamen ist. Ansonsten gibt er einen generischen Platzhalter `Ein Nutzer` zurück.

**Funktionsweise:** Der Nutzer wird mit dem Methodenaufruf `get_user_by('login', $display_name)` ermittelt. Falls kein Nutzer ermittelt werden konnte, wird `Ein Nutzer` zurückgegeben, ansonsten wird geprüft, ob der Nutzer einen Spitznamen eingestellt hat und ob dieser nicht dem Benutzernamen gleicht. Sollte der Spitzname dem Benutzernamen gleichen oder kein Spitznamen vorhanden sein, so wird `Ein Nutzer` zurückgegeben, ansonsten wird der eingestellte Spitzname zurückgegeben.

**Parameter:**
- `$display_name` (string): Der zu ändernde angezeigte Name.

**Rückgabewert:**
- (string): Der geänderte angezeigte Name, entweder der Spitzname oder "Ein Nutzer".


### `hide_author_link($link, $author_id)`
Diese Methode ändert den Autor-Link in eine generische URL (`#`), um zu verhindern, dass der Benutzername durch URLs offengelegt wird.

**Funktionsweise:** Gibt sofort `"#"` zurück.

**Parameter:**
- `$link` (string): Der ursprüngliche Autor-Link.
- `$author_id` (int): Die ID des Autors.

**Rückgabewert:**
- (string): Die geänderte URL, immer `"#"`.

### `hide_usernames_in_rest($response, $user, $request)`
Diese Methode ändert die Benutzerdaten in REST API-Antworten, indem Benutzernamen durch Spitznamen oder einen generischen Platzhalter "WordpressUser" ersetzt werden.

**Funktionsweise:** Die Daten der Response werden mit `$response->get_data()` abgerufen und in einer Variablen `$data` gespeichert. Wenn der Benutzer einen Spitznamen hat und dieser nicht mit dem Benutzernamen übereinstimmt, werden `name` und `slug` in `$data` auf den Spitznamen gesetzt, andernfalls auf `WordpressUser`. Anschließend wird mit `$response->set_data($data)` die Response-Data geupdated und `$reponse` zurückgegeben. 

**Parameter:**
- `$response` (WP_REST_Response): Die ursprüngliche REST API-Antwort.
- `$user` (WP_User): Das Benutzerobjekt.
- `$request` (WP_REST_Request): Die aktuelle Anfrage.

**Rückgabewert:**
- (WP_REST_Response): Die geänderte REST API-Antwort.



### `warn_if_display_name_is_username()`
Diese Methode zeigt eine Warnmeldung im WordPress Admin-Dashboard an, wenn der Anzeigename des angemeldeten Benutzers mit seinem Benutzernamen übereinstimmt, was auf ein potenzielles Sicherheitsrisiko hinweist.

**Funktionsweise:** Der Nutzer wird mit `wp_get_current_user()` ermittelt. Wenn der Benutzername gleich dem Spitznamen ist, so wird die Warnmeldung
    <div style="
    border: 1px solid #c3c4c7;
    border-left-width: 4px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .04);
    padding: 1px 12px;
    border-left-color: #dba617;">
        <p>
            Your display name is the same as your username. This can expose your username publicly, which is a security risk. Please change your display name in your profile settings.
        </p>
    </div>

im Admin-Dashboard angezeigt.

### `redirect_author_pages()`
Diese Methode leitet alle Anfragen zu Autorenseiten auf die Startseite um, um die Offenlegung von Benutzernamen durch Autoren-URLs zu verhindern.

**Funktionsweise:** Es wird mit `is_author()` geprüft, ob es sich um eine Authorpage handelt. Falls es sich um eine Authorpage handelt, so wird man auf die `home_url()` - in unserem Fall auf die Indexpage `/` - umgeleitet und das Skript terminitiert per `exit`.

## Entwicklerhinweise

- Methodenrückgabewerte werden entweder mit `esc_html()` oder `esc_attr()` escaped.