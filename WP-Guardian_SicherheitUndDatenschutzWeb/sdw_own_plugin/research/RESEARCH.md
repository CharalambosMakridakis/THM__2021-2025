# Daten sammeln

## Welche Daten sammlen wir?
Wir sammeln Uhrzeit des Zugriffs, die IP-Adresse, den Port, die Methode, das Protokoll, die URL mit zugehörigen Query-Parametern und den User-Agent.

## Welcher Hook wird genutzt?
Der verwendete Hook ist `init`, der über `do_action()` die Log-Funktion ausführt, so dass sowohl Zugriffe auf die Webseite, als auch auf den Admin-Bereich der Webseite protokolliert werden.

## Woher kommen die Daten?
Die Daten (außgenommen die Uhrzeit des Zugriffs) werden aus globalen PHP Server- und Ausführungsumgebungsvariablen entnommen:
- Als Uhrzeit wird die Zeit des Eintrags in die Datenbank genutzt.
- Die IP-Adresse wird aus `$_SERVER['REMOTE_ADDR']` entnommen.
- Der Port wird aus `$_SERVER['REMOTE_PORT']` entnommen.
- Die Methode wird aus `$_SERVER['REQUEST_METHOD']` entnommen.
- Das Protokoll wird aus `$_SERVER['SERVER_PROTOCOL']` entnommen.
- Die URL wird aus `$_SERVER['REQUEST_URI']` entnommen.
- Der User-Agent wird aus `$_SERVER['HTTP_USER_AGENT']` entnommen.

## Grenzen kennenlernen

### Gehen Browseranfragen zuerst an PHP oder zuerst an den Apache Dienst?
Die Browseranfragen gehen zuerst an den Webserver (Apache Dienst), der die Anfrage dann - bei Bedarf - an PHP weiterleitet.
### Welcher der beiden Prozesse liefert Bilder, CSS, Javascript und alle anderen tatsächlich exisiterende Dateien aus?
Existierende Dateien werden vom Webserver (Apache Dienst) ausgeliefert (Static-Files).
### Welcher der Prozesse behandelt Fehler wie z.B. 404?
Der Webserver (Apache Dienst) behandelt Fehler wie z.B. 404.
### Was genau passiert bei Adressen wie /beispiel-seite/?
- `/beispiel-seite/` ist ein Permalink, die für Benutzerfreundlichkeit und SEO genutzt werden.
- Wenn man die `/beispiel-seite/` aufruft, dann sendet der Browser eine GET-Request an die URL.
- Die Anfrage wird dann vom Webserver bearbeitet und leitet die dann an den PHP Dienst weiter, da es sich um eine WordPress-Seite handelt.
- WordPress führt dann eine Datenbankabfrage durch, um die Inhalte der Seite mit dem Permalink "beispiel-seite" abzurufen.
- WordPress generiert dann die HTML-Seite.
- Die generierte HTML-Datei wird dann an den Webserver zurückgeschickt.
- Der Webserver sendet dann die erhaltene HTML-Datei an den Client.
### Enthält unser Log wirklich alle Anfragen? Wie aussagekräftig ist unser Log?
Unser Log kann nicht alle Anfragen erhalten, da unser Plugin PHP-Seitig ist, sprich Anfragen an Dateien (Static-Files) werden direkt vom Webserver ausgeliefert, ohne PHP miteinzubeziehen.
In unserem Log entstehen immer noch "Duplikate", daher benötigen wir noch zusätzliche Spalten an Informationen, um Requests besser zu unterscheiden.

## Welche und wie viele Daten sind in unsere CSV-Dateien?
### Suspicious.csv
Unsere suspicious.csv hat ungefähr 29 Tausend Einträge, die mit Hilfe von WP-Scan generiert worden sind.
Der genutze Befehl ist `docker run -it --rm --network="host" wpscanteam/wpscan --update --url http://localhost/ --e ap,at,tt,cb,dbe,u1-5,m1-15`
### Regular.csv
Unsere regular.csv hat 27 Einträge, die wir durch Simulation des Nutzerverhaltens auf unserer Webseite erzeugt haben.