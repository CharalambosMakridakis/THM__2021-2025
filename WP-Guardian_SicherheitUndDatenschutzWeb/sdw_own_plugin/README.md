# WP-Guardian <img src="assets/logo.png" style="border-radius: 20%" width="40">
<p>WP-Guardian ist eine moderne Erweiterung für Wordpress, welche Ihre Website und die Daten Ihrer Nutzer schützt. WP-Guardian bietet dabei folgende Features:</p>

<list>
    <ol>
        <h4><li style="font-weight: bold">Einfache Installation (Plug and Play)</li></h4>
            <p>WP-Guardian lässt sich nach der Installation mit einem Mausklick starten. Keine weitere Konfiguration ist nötig, damit Sie vollumfänglich vom Schutz profitieren.</p>
        <h4><li style="font-weight: bold">Schutz vor schädlichen Zugriffen</li></h4>
            <p>WP-Guardian kennt die meisten Ressourcen, auf die ein Angreifer abzielt, und blockiert diese, ohne den Funktionsumfang Ihrer Website einzuschränken. Wenn ein Angreifer versucht, auf mehrere durch WP-Guardian geschützte Ressourcen zuzugreifen, wird ihm für kurze Zeit der allgemeine Zugriff auf die durch WP-Guardian geschützte Website verweigert.</p>
        <h4><li style="font-weight: bold">Verbesserte Sicherheit Ihrer Nutzerdaten</li></h4>
            <p>WP-Guardian schützt die Daten Ihrer Nutzer, damit diese nicht Opfer von böswilligen Angriffen werden.</p>
        <h4><li style="font-weight: bold">Schutz gegen Schwachstellen-Scans</li></h4>
            <p>Für die Suche nach Schwachstellen auf Ihrer Website, werden oft Programme verwendet, welche mehrere mögliche Schwachstellen testen. WP-Guardian schützt Ihre Website vor diesen Scans.</p>
        <h4><li style="font-weight: bold">Zugriffsprotokoll</li></h4>
            <p>WP-Guardian protokolliert jeden Zugriff auf Ihre Website, damit Sie den Überblick behalten.</p>
    </ol>
</list>

#### Nutzerhandbuch
Nach Aktivierung der Erweiterung wird "THM Security" unter dem Reiter "Tools" im  Adminbereich Ihrer Website um die beiden Punkte "Access Log" und "Banned IPs" erweitert. Unter "Access Log" können die protokollierten Seitenzugriffe eingesehen werden. Unter "Banned IPs" können Sie sehen, welche und wie viele IP-Adressen blockiert sind.  

#### Mindestanfoderungen:
 - WordPress 6.5.5
 - PHP 8.0

## FAQ
### Ist das WP-Guardian kostenlos?
Ja, unsere WordPress-Sicherheitslösung ist völlig kostenlos.

### Erfasst WP-Guardian alle Zugriffe? 
Nein, WP-Guardian erfasst lediglich Zugriffe auf die Wordpress-Instanz, jedoch nicht auf statische Dateien, wie Bilder oder Videos.

### Schützt WP-Guardian vor allen Bedrohungen?
Nein, WP-Guardian bietet lediglich mehr Sicherheit in den oben genannten Punkten und kann auch keine Garantie für die Sicherheit Ihrer Website geben.

### Was sind die häufigsten Angriffe auf WordPress?
WordPress ist eine im Allgemeinen sichere Software, jedoch aufgrund ihrer weiten Verbreitung für die Erstellung von Websites ein beliebtes Angriffsziel. Die Hauptursachen für Angriffe auf WordPress sind der Einsatz unsicherer Plugins, veralteter Software und Themes sowie schwacher Passwörter.

## Datenschutzinformationen

<p>WP-Guardian arbeitet nach dem Prinzip der Datensparsamkeit, sodass nur die Daten der Nutzer verarbeitet werden, welche essenziell für die Funktion der Erweiterung sind. Für die Funktionalität benötigt WP-Guardian folgende Daten: </p>

<list>
    <ol>
        <li style="font-weight: bold">IP-Adressen</li>
            <p>Die IP-Adresse ist eine Adresse des Internet-Protokolls, welche WP-Guardian nuzt, um Nutzer und potenzielle Angreifer zu identifizieren.</p>
        <li style="font-weight: bold">URL</li>
            <p>Die URL (Uniform Resource Locator) beschreibt die Adresse der angeforderten Ressource auf dem Server. WP-Guardian verwendet die URL, um festzustellen, welche Seiten/Ressourcen aufgerufen werden. Teilweise können hier zusätzlich Daten des Nutzers übertragen werden (z.B.: Optionen zum Filtern des Seiteninhalts).</p>
        <li style="font-weight: bold">Nutzerklasse</li>
            <p>Die Nutzerklasse wird von WP-Guardian zu jeder Anfrage generiert. Abhängig von der Ressource, auf welche zugegriffen wurde, wird jeder Anfrage einer IP-Adresse eine Klasse zugeordnet. Diese Klasse bestimmt ob die Anfrage als verdächtig oder normal eingestuft wird.</p>
        <li style="font-weight: bold">Datum und Uhrzeit</li>
            <p>WP-Guardian speichert Datum und Uhrzeit von jedem Zugriff, um diese zeitlich einordnen zu können.</p>
    </ol>
</list>

#### Datenspeicherung:
WP-Guardian überprüft bei jedem Seitenzugriff, die Aktualität der gespeicherten Daten. Sollte ein Eintrag im Zugriffsprotokoll zum Zeitpunkt der Überprüfung älter als `14 Tage` sein, wird dieser gelöscht. Einträge in der Liste der blockierten IP-Adressen werden nach dem selben Verfahren gelöscht, wenn sie älter als `6 Monate` sind. 

#### Datenschutzerklärung:
Erweitern Sie die Datenschutzerklärung Ihrer Website um folgenden Text:
```
WP-Guardian

Einsatz von WP-Guardian:
Diese Seite verwendet die Sicherheitserweiterung WP-Guardian, welche Daten verarbeitet, um Sicherheit und Nutzbarkeit zu verbessern.

Art der Verarbeitung:
WP-Guardian verwendet Daten, welche vom Browser des Seitenbesuchers übertragen werden, um die Sicherheit und Nutzung unserer Websiten zu verbessern. Die erhobenen Daten sind dabei nur von WP-Guardian und Administratoren der Seite einsehbar.

Erhobene Daten:
1: IP-Adressen: Die IP-Adresse ist eine Adresse des Internet-Protokolls.
2: URL: Die URL (Uniform Resource Locator) beschreibt die Adresse der angeforderten Ressource auf dem Server.
3: Nutzerklasse: Die Nutzerklasse wird von WP-Guardian zu jeder Anfrage generiert, abhängig von der Ressource, auf welche zugegriffen wurde.
4: Datum und Uhrzeit: WP-Guardian speichert Datum und Uhrzeit von jedem Zugriff.

Datenlöschung:
WP-Guardian überprüft bei jedem Seitenzugriff die Aktualität der gespeicherten Daten. Sollte ein Eintrag im Zugriffsprotokoll zum Zeitpunkt der Überprüfung älter als 14 Tage sein, wird dieser unwiderruflich gelöscht. Einträge in der Liste der blockierten IP-Adressen werden nach dem gleichen Verfahren unwiderruflich gelöscht, wenn sie älter als 9 Monate sind.

Zwecke der Verarbeitung:
1: IP-Adressen: Die IP-Adresse nutzt WP-Guardian, um Nutzer und potenzielle Angreifer zu identifizieren.
2: URL: Die URL (Uniform Resource Locator) verwendet WP-Guardian, um festzustellen, welche Seiten und Ressourcen aufgerufen werden.
3: Nutzerklasse: Die Nutzerklasse wird von WP-Guardian zu jeder Anfrage generiert, um zu einem späteren Zeitpunk zeiteffizient festellen zu können, ob bereits verdächtige Aufrufe über die assoziierte IP-Adressen getätigt wurden.  
4: Datum und Uhrzeit: WP-Guardian speichert Datum und Uhrzeit, um diese zeitlich einordnen zu können. 

Empfänger:
Empfänger der Daten sind: 

1: Administratoren der Seite und Personen mit ausreichenden Berechtigungen, um auf die Datenbank und/oder den Adminbereich der Seite zuzugreifen.  
2: WP-Guardian selbst verarbeitet und analysiert die erhobenen Daten gemäß den festgelegten Zwecken lokal.

Speicherdauer:
Die Löschung erfolgt für alle Daten, welche zum Zeitpunkt der Überprüfung veraltet sind. Daten gelten 
als veraltet nach Ablauf der Fristen, welche in 'Datenlöschung' beschrieben werden. Da die Überprüfung der von Seitenzugriffen abhängig ist, kann die maximale Lebensdauer der Daten nicht bestimmt werden. 

Rechtsgrundlage:
Als Rechtsgrundlage der Erhebung der Daten gilt Art. 6 DSGVO (Rechtmäßigkeit der Verarbeitung).
```

## Für Administratoren und Entwickler

[Classifier](./docs/classifier.md)

[Database](./docs/database.md)

[Log](./docs/log.md)

[Username-Protection](./docs/username_protection.md)






