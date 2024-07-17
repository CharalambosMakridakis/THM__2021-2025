# classifier.php

## Überblick

Die `classifier.php`-Datei wurde entwickelt, um Anfragen an die Worpress-Instanz zu klassifizieren, sodass später zeiteffizient festgestellt werden kann, wie viele verdächtige Anfragen über eine IP-Adresse getätigt wurden. Ob eine Anfrage verdächtig ist, wird anhand der Ressource bewertet, auf welche zugegriffen wurde.

### Hauptfunktionen

- Jede Anfrage in eine "Verdächtigkeits"-Klasse einordnen.
- Anfragen abbrechen und IP-Adresse blockieren, falls die assoziierte IP-Adresse bereits mehrere verdächtige Zugriffe getätigt hat.
- Verdächtige IP-Adressen in die IP-Blacklist eintragen.
- Für Testzwecke die Klassiefizierung über den Header sichtbar machen.

## Klassenvariablen

### `private static $request_class`
Diese Klassenvariable speichert die Klassifizierung der Anfrage.

## Verwendete Hooks

### Aktionen
<list>
    <ol>
        <li style="font-weight: bold">wp_loaded</li>
            <p>Ruft eine Methode auf, die Anfragen klassifiziert.</p>
        <li style="font-weight: bold">plugins_loaded</li>
            <p>Ruft eine Methode auf, die überprüft, ob eine IP-Adresse blockiert ist und gegebenenfalls die Anfrage beendet.</p>
    </ol>
</list>

## Methoden

### `classify_init()`
Diese Methode klassifiziert die Anfrage und blockiert die `IP-Adresse`, falls bereits zu viele verdächtige Anfragen gestellt wurden.

**Funktionsweise:** Die statische Variable `$request_class` wird  mit dem Rückgabewert von `classify_request()` initialisiert. Anschließend werden für Testzwecke die Header `X-THMSEC` auf `ENABLED` und `X-THMSEC-CLASS` auf `$request_class` gesetzt. Wenn `$request_class` nicht dem String `normal` entspricht, wird die Methode `get_unwanted_requests_count()` der Datenbank-Klasse mit der `IP-Adresse` und `24 * 7` (Zeitraum in dem die verdächtigen Anfragen gezählt werden sollen) aufgerufen und der Rückgabewert wird in `$count` gespeichert. Sollte `$count` > 20 sein und die IP-Adresse noch nicht geblockt sein (überprüft durch Aufruf der  Methode `is_ip_blocked()` der Datenbank-Klasse), wird die IP-Adresse, durch den Aufruf der Methode `append_ip_blacklist_log()` der Datenbank-Klasse, der IP-Blacklist hinzugefügt. Anderfalls werden die Header `X-THMSEC-COUNT` auf `$count` und `HTTP/1.1 404 Not Found` gesetzt. Anschließend wird das Skript per `die('Your IP address has been blocked. If you think that this is an error, please contact us.')` terminiert.

### `classify_request()`
Die Methode `classify_request()` gleicht die URL der Abfrage mit der URL von potenziell sensiblen Ressourcen der Wordpress-Instanz ab und gibt die entsprechende Klassifizierung zurück.

**Funktionsweise:** Die URL der Ressource wird in der Varible `$uri` gespeichert. Anschließend wird jede URL der potenziell sensiblen Ressource durch `strpos()` mit `$uri` abgeglichen.

**Rückgabewert:**
- (string): Die zugeordnete Klasse

### `get_request_class()`
Diese Methode gibt die Klassenvariable `$request_class` zurück.

**Rückgabewert:**
- (string): Die zugeordnete Klasse



### `is_ip_blocked()`
Diese Methode terminiert das Skript, sollte die IP-Adresse der laufenden Abfrage blockiert sein.  

**Funktionsweise:** Die IP-Adresse der Abfrage wird der Methode `is_ip_blocked()` der Datenbank-Klasse übergeben. Sollte diese true zurückgeben, wird das Skript terminiert.  

## Entwicklerhinweise

- Sollten durch Updates oder andere Plugins Dateinen entstehen, welche bei einem Zugriff auf eine verdächtiges Verhalten hindeuten, müssen diese in `classify_request()` ergänzt werden.
- `X-THMSEC`-Header sollten nur für Testzwecke genutzt werden.
- Es können keine static-files klassifiziert werden.
