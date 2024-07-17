# log.php

## Überblick

Die `log.php`-Datei wurde entwickelt, um Einträge in das Access-Log hinzuzufügen, dieses im Adminbereich der Seite anzuzeigen, die IP-Blacklist im Adminbereich anzuzeigen und den nötigen Menüpunkt in den Adminbereich hinzuzufügen.  

### Hauptfunktionen

- Den Adminbereich um den Menüpunkt `THM Security` erweitern. 
- Die `Access Log`-Seite mit Inhalt der Datenbank füllen und rendern. 
- Die `Banned IPs`-Seite mit Inhalt der Datenbank füllen und rendern. 
- Alle Zugriffe auf die Wordpress-Instanz als neuen Eintrag in das Zugriffsprotokoll speichern. 

## Verwendete Hooks

### Aktionen
<list>
    <ol>
        <li style="font-weight: bold">admin_menu</li>
            <p>Ruft eine Methode auf, die den Adminbereich um den Menüpunkt THM Security erweitert.</p>
        <li style="font-weight: bold">shutdown</li>
            <p>Ruft eine Methode auf, die den Zugriff auf die  Wordpress-Instanz protokolliert.</p>
    </ol>
</list>

## Methoden

### `add_menu()`
Diese Methode nutzt die Wordpress-Methode `add_management_page()`, um einen weitere Menüpunkt `THM Security` zu registrieren und legt fest, dass beim Öffnen dieses Menüpunktes `render_management_page()` aufgerufen wird. 

**Funktionsweise:** Die  Methode `add_management_page()` wird mit den Argumenten `THM Security` (Seitentitel), `THM Security` (Menütitel), `manage_options` (benötigten Berechtigungen),`thm-security` (Menü-Slug) und `render_management_page()` (Callback  für Rendering) aufgerufen. 

### `render_management_page()`
Die Methode überprüft die Nutzer-Berechtigungen und erweitert den  `THM Security`-Menüpunkt um die beiden Unterpunkte `Access Log` und `Banned IPs`.  

**Funktionsweise:** Die Methode `render_management_page()` überprüft, ob der Nutzer die `manage_options`-Berechtigung hat und bricht bei fehlenden Berechtigungen die Ausgabe der Seite  durch `return` ab. Wennn der Nutzer die nötige Berechtigung hat, wird der momentane Tab (`@$_GET['tab']`) in `$tab` gespeichert und durch `sanitize_text_field()` escaped. Anschließend wird die Navbar um die beiden Unterpunkte `Access Log` und `Banned IPs` erweitert, indem zwei `<a>`-Tags in `<nav class="nav-tab-wrapper">` gerendert werden. Wenn `empty($tab)`, wird `render_access_log()` anfgerufen. Wenn `$tab==='page2'`, wird `render_ip_blacklist_log`()` aufgerufen. 

### `render_access_log()`
Diese Methode rendert die Einträger des Access-Logs als HTML-Tabelle.

**Funktionsweise:** Die Methode `render_access_log()` speichert den Rückgabewert von `get_access_log`() der Datenbankklasse in `$logs`. Anschließend rendert sie `<table class="wp-list-table widefat fixed striped table-view-list">` mit den Tableheadern `Timestamp`, `IP`, `URL` und `CLASSIFICATION`. Die Tablerows werden mit `$log->time`, `$log->client`, `$log->url` und `$log->classification` befüllt und jeweils durch `esc_html()` escaped.


### `render_ip_blacklist_log()`
Diese Methode rendert die Einträger der IP-Blacklist als HTML-Tabelle.

**Funktionsweise:** Die Methode `render_ip_blacklist_log()` speichert den Rückgabewert von `get_ip_blacklist_log`() der Datenbank-Klasse in `$logs`. Anschließend rendert sie `<table class="wp-list-table widefat fixed striped table-view-list">` mit den Tableheadern `Timestamp` und `IP`. Die Tablerows werden mit `$log->time` und `$log->client` befüllt und jeweils durch `esc_html()` escaped. 

### `log_access()`
Diese Methode sammelt Daten wie `IP-Adresse`, `URL` und die `Nutzerklasse` und gibt diese an die Datenbank-Klasse weiter, falls die `IP-Addresse` nicht blockiert ist.

**Funktionsweise:** Wenn die `is_ip_blocked()`-Methode der Datenbank-Klasse mit den Argumenten `$_SERVER['REMOTE_ADDR']` `true` zurückgibt, wird die Methode beendet. Andernfalls wird `append_access_log()` der Datenklasse mit den Argumenten `$_SERVER['REMOTE_ADDR']`, `$_SERVER['REQUEST_URI']` und `Classifier::get_request_class()` aufgerufen.

## Entwicklerhinweise
- Falls weitere Daten beim Zugriff auf die Webseite erfasst und verarbeitet werden sollen, muss die Datenschutzerklärung entsprechend angepasst werden.