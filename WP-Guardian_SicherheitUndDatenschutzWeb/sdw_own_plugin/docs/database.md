# database.php

## Überblick

Die `database.php`-Datei bietet Datenbank-Funktionalitäten für das WP-Guardian Plugin. Es verwaltet Access-Logs, IP-Blacklist-Einträge und sorgt für die ordnungsgemäße Handhabung und Bereinigung von Datenbankeinträgen.

### Hauptfunktionen
- Initialisierung, Installation und Deinstallation der Datenbanktabellen
- Verwaltung und Abruf von Access-Log-Einträgen
- Verwaltung und Abruf von IP-Blacklist-Einträgen
- Löschen alter Datenbankeinträge (Access-Log-Einträge älter als 14 Tagen, IP-Blacklist-Einträge älter als 6 Monaten)

## Verwendete Hooks

### Actions
<list>
    <ol>
        <li style="font-weight: bold">plugins_loaded</li>
            <p>Ruft Methoden auf, die die Datenbank initialisieren und alte Einträge aus den Tabellen löschen.</p>
    </ol>
</list>

### Register

<list>
    <ol>
        <li style="font-weight: bold">register_uninstall_hook</li>
            <p>Ruft eine Methode auf, die die zuvor erzeugten Tabellen und die Siteoption löscht.</p>
    </ol>
</list>

## Klassenvariablen

### `private static $db_version = '1';`
Diese Klassenvariable speichert die "Version der Datenbank". Sie wird intern dazu verwendet, um die Datenbank (neu) zu installieren, wenn sich der Wert ändert.

### `private static $table_access_name = 'thm_security_access_log';`
Diese Klassenvariable speichert den Tabellennamen der Access-Log-Tabelle.

### `private static $table_blacklist_name = 'thm_security_ip_blacklist';`
Diese Klassenvariable speichert den Tabellennamen der IP-Blacklist-Tabelle. 

## Methoden

### `init()`
Diese Methode initialisiert die Datenbank, wenn der Wert der Klassenvariablen `$db_version` ungleich dem Wert der gespeicherten Siteoption ist.

**Funktionsweise:** 
Überprüft mit 
- `get_site_option(self::$table_access_name . '_db_version') != $db_version`

ob die gespeicherte Datenbankversion mit der aktuellen Version übereinstimmt. Falls nicht, wird die Methode `install_db()` aufgerufen.

### `install_db()`
Diese Methode erstellt die erforderlichen Datenbanktabellen und aktualisiert die gespeicherte Datenbankversion.

**Funktionsweise:**
Zuerst wird die globale Variable `$wpdb` aufgerufen, die den Zugriff auf die WordPress-Datenbank ermöglicht. Anschließend werden die Variablen `$db_access` und `$db_blacklist` definiert, um die vollständigen Namen der zu erstellenden Tabellen zu enthalten. Diese Namen setzen sich aus dem Tabellenpräfix `$wpdb->prefix` und den statischen Variablen `self::$table_access_name` bzw. `self::$table_blacklist_name `zusammen. Zudem wird die Variable `$charset_collate` anhand der Methode `$wpdb->get_charset_collate()` mit dem Zeichensatz und der Kollation der Datenbank deklariert. 

Es wird ein SQL-Statement in der Variable `$table` definiert, das die Struktur der ersten Tabelle `$db_access` beschreibt. Diese Tabelle enthält vier Spalten:

<list>
    <ol>
        <li style="font-weight: bold">time</li>
            <p>Ein Timestamp, der standardmäßig auf den aktuellen Zeitstempel gesetzt.</p>
        <li style="font-weight: bold">client</li>
            <p>Ein VARCHAR-Feld mit einer Länge von 32 Zeichen. Hier wird die IP-Adresse des Nutzers gespeichert.</p>
        <li style="font-weight: bold">url</li>
            <p>Ein VARCHAR-Feld mit einer Länge von 128 Zeichen. Hier wird die URL des Requests gespeichert.</p>
        <li style="font-weight: bold">classification</li>
            <p>Ein VARCHAR-Feld mit einer Länge von 32 Zeichen. Hier wird die anhand vom Classifier erkannten Klassifizierung gespeichert.</p>
    </ol>
</list>

Anschließend wird die Funktion `dbDelta($table)` aufgerufen, um die Tabelle anhand des definierten SQL-Statements zu erstellen oder zu aktualisieren.

Ein ähnliches SQL-Statement wird in der Variable `$second_table` definiert, das die Struktur der zweiten Tabelle `$db_blacklist` beschreibt. Diese Tabelle enthält zwei Spalten:


<list>
    <ol>
        <li style="font-weight: bold">client</li>
            <p>Ein VARCHAR-Feld mit einer Länge von 32 Zeichen. Hier wird die IP-Adresse des "Nutzers" gespeichert.</p>
        <li style="font-weight: bold">time</li>
            <p>Ein Timestamp, der standardmäßig auf den aktuellen Zeitstempel gesetzt wird.</p>
    </ol>
</list>

Auch hier wird `dbDelta($second_table)` aufgerufen, um die zweite Tabelle zu erstellen oder zu aktualisieren.

Schließlich wird die Funktion `update_site_option()` verwendet, um die Version der Datenbankstruktur zu speichern. Der Name der Option wird durch `self::$table_access_name . '_db_version'` und der Wert durch `self::$db_version` bestimmt.

### `uninstall_db()`
Diese Methode entfernt die Datenbanktabellen und die gespeicherte Datenbankversion.

**Funktionsweise:** 
Zuerst wird die globale Variable `$wpdb` aufgerufen, die den Zugriff auf die WordPress-Datenbank ermöglicht. Anschließend werden die Variablen `$table_name` und `$table_name2` definiert, um die vollständigen Namen der zu löschenden Tabellen zu enthalten. Diese Namen setzen sich aus dem Tabellenpräfix `$wpdb->prefix` und den statischen Variablen `self::$table_access_name` bzw. `self::$table_blacklist_name` zusammen.

Danach führt der Befehl `$wpdb->query("DROP TABLE IF EXISTS $table_name")` eine SQL-Abfrage aus, die die Tabelle löscht, wenn sie existiert.
Der gleiche Vorgang wird für die zweite Tabelle mit dem Befehl `$wpdb->query("DROP TABLE IF EXISTS $table_name2")` durchgeführt.

Schließlich entfernt der Befehl `delete_site_option(self::$table_access_name . '_db_version')`  die gespeicherte Version der Datenbank.

### `get_access_log()`
Diese Methode ruft die Einträge des Access-Logs ab.

**Funktionsweise:**
Zuerst wird die globale Variable `$wpdb` aufgerufen, die den Zugriff auf die WordPress-Datenbank ermöglicht. Anschließend wird die Variable `$table_name` definiert, um den vollständigen Namen der Tabelle zu enthalten. Dieser Name setzt sich aus dem Tabellenpräfix `$wpdb->prefix` und der statischen Variable `self::$table_access_name` zusammen.

Danach führt der Befehl `$logs = $wpdb->get_results("SELECT * FROM $table_name LIMIT 3000")` eine SQL-Abfrage aus, die bis zu 3000 Einträge aus der Tabelle `$table_name` abruft.

Schließlich gibt die Methode `$logs` zurück.

**Rückgabewert:**
(Array von Objekten): `$logs`

### `get_ip_blacklist_log()`
Diese Methode ruft die Einträge des IP-Blacklist-Logs ab.

**Funktionsweise:** 
Zuerst wird die globale Variable `$wpdb` aufgerufen, die den Zugriff auf die WordPress-Datenbank ermöglicht. Der Tabellenname der Blockliste wird aus `$wpdb->prefix` und  `self::$table_blacklist_name;` zusammengesetzt und in `$table_name` gespeichert. 
Danach führt der Befehl `$logs = $wpdb->get_results("SELECT * FROM $table_name LIMIT 3000")` eine SQL-Abfrage aus, die bis zu 3000 Einträge aus der Tabelle `$table_name` abruft.
Anschließend wird `$logs` zurückgegeben.

**Rückgabewert:**
(Array von Objekten): `$logs`

### `append_access_log($client, $url, $classification)`
Fügt einen neuen Eintrag zum Access-Log hinzu.

**Funktionsweise:** 
Zuerst wird die globale Variable `$wpdb` aufgerufen, die den Zugriff auf die WordPress-Datenbank ermöglicht. Der Tabellenname des Access-Log wird aus `$wpdb->prefix` und  `self::$table_access_name` zusammengesetzt und in `$table_name` gespeichert. Anschließend wird `$wpdb->insert()` mit den Argumenten `$table_name` und `['client' => $client, 'url' => $url, 'classification' => $classification]` aufgerufen.

**Parameter:**
- `$client` (string): Die Client-IP-Adresse.
- `$url` (string): Die aufgerufene URL.
- `$classification` (string): Die Klassifizierung des Zugriffs.

### `append_ip_blacklist_log($client)`
Fügt einen neuen Eintrag zur IP-Blacklist hinzu.

**Funktionsweise:** 
Zuerst wird die globale Variable `$wpdb` aufgerufen, die den Zugriff auf die WordPress-Datenbank ermöglicht. Der Tabellenname der Blockliste wird aus `$wpdb->prefix` und  `self::$table_blacklist_name` zusammengesetzt und in `$table_name` gespeichert. Anschließend wird `$wpdb->insert()` mit den Argumenten `$table_name` und `['client' => $client]` aufgerufen.

**Parameter:**
- `$client` (string): Die Client-IP-Adresse.

### `get_unwanted_requests_count($ip, $timeframe_hours)`
Ruft die Anzahl der unerwünschten Anfragen für eine bestimmte IP-Adresse innerhalb eines gegebenen Zeitrahmens ab.

**Funktionsweise:** 
Zuerst wird die globale Variable `$wpdb` aufgerufen, die den Zugriff auf die WordPress-Datenbank ermöglicht. Der Tabellenname des Access-Log wird aus `$wpdb->prefix` und  `self::$table_access_name` zusammengesetzt und in `$table_name` gespeichert. Anschließend wird der Timestamp berechnet von dem ältesten Eintrag, welcher berücksichtigt werden soll (alle älteren Einträge werden vernachlässigt) `date('Y-m-d H:i:s', strtotime("-$timeframe_hours hours"))` und in `$timeframe` gespeichert. Folgende Query wird prepared, ausgeführt und das Ergebnis `$count` gespeichert: `"SELECT COUNT(*) FROM $table_name WHERE client = '%s' AND classification != 'normal' AND time > '%s'", $ip, $timeframe`.

**Parameter:**
- `$ip` (string): Die IP-Adresse.
- `$timeframe_hours` (int): Der Zeitrahmen in Stunden.

**Rückgabewert:**
- `count` (int): Die Anzahl der unerwünschten Anfragen.

### `is_ip_blocked($ip)`
Diese Methode üperprüft, ob die übergebene `IP-Adresse` auf der Blockliste steht.

**Funktionsweise:** 
Zuerst wird die globale Variable `$wpdb` aufgerufen, die den Zugriff auf die WordPress-Datenbank ermöglicht. Der Tabellenname der Blockliste wird aus `$wpdb->prefix` und  `self::$table_blacklist_name` zusammengesetzt und in `$table_name` gespeichert. Anschließend wird folgende SQL-Query prepared, ausgeführt und das Ergenis in `$result` gespeichert: `"SELECT COUNT(*) FROM $table_name WHERE client = '%s'", $ip`.

**Parameter:**
- `$ip` (string): Die IP-Adresse.

**Rückgabewert:**
(bool): True, wenn die IP-Adresse blockiert ist, sonst False.

### `delete_old_ip_blacklist_entries()`
Diese Methode löscht alle Einträge der Blockliste, welche älter als `6 Monate` sind.

**Funktionsweise:** 
Zuerst wird die globale Variable `$wpdb` aufgerufen, die den Zugriff auf die WordPress-Datenbank ermöglicht. Der Tabellenname der Blockliste wird aus `$wpdb->prefix` und  `self::$table_blacklist_name` zusammengesetzt und in `$table_name` gespeichert. Der Timestamp vor `6 Monaten` wird berechnet duch `date('Y-m-d H:i:s', strtotime("-6 months"))` und in `$timeframe` gespeichert. 
Anschließend wird folgende SQL-Query prepared und ausgeführt: `"DELETE FROM $table_name WHERE time < '%s'", $timeframe`.


### `delete_old_access_log_entries()`
Diese Methode löscht alle Einträge des Access-Logs, welche älter als `14 Tage` sind.

**Funktionsweise:** 
Zuerst wird die globale Variable `$wpdb` aufgerufen, die den Zugriff auf die WordPress-Datenbank ermöglicht. Der Tabellenname des Access-Logs wird aus `$wpdb->prefix` und  `self::$table_access_name` zusammengesetzt und in `$table_name` gespeichert. Der Timestamp vor `14 Tagen` wird berechnet duch `date('Y-m-d H:i:s', strtotime("-14 days"))` und in `$timeframe` gespeichert. 
Anschließend wird folgende SQL-Query prepared und ausgeführt: `"DELETE FROM $table_name WHERE time < '%s'", $timeframe`.

## Entwicklerhinweise

- Da ein Prefix vor dem Tabellennamen erzeugt wird, sollte es zu keinem Konflikt mit anderen, gleichnamigen Tabellen kommen.
- Wenn die Länge des Eingabestrings größer ist als die definierten Spaltengrößen der Tabelle, kann es zu unvorhersehbarem Verhalten kommen.
- Wenn die Speicherdauer geändert wird, muss die Datenschutzerklärung entsprechend angepasst werden.
- Mit jedem Request wird die Datenbank größer, was zu einem steigenden Speicherbedarf führt. Daher ist es wichtig, die Serverkapazität regelmäßig zu überprüfen und zu erweitern.
- Mit Apache Benchmark kann man die die Effizienz der Datenbankabfragen unter hoher Anfragefrequenz bewerten.