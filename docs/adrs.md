# ADR-001: Wahl der Datenbank

## Status
Accepted

## Kontext
Für die Entwicklung unserer Auktionsplattform benötigen wir eine Datenbank, die strukturierte Daten zuverlässig speichert und insbesondere bei gleichzeitigen Geboten eine hohe Datenkonsistenz gewährleistet.  
Typische Daten sind Benutzer, Auktionen, Gebote und Rollen, die in klaren Beziehungen zueinander stehen.

## Entscheidung
Wir verwenden eine relationale Datenbank. Zur Auswahl standen PostgreSQL und MySQL.  

Beide Systeme erfüllen die grundlegenden Anforderungen hinsichtlich Stabilität, Transaktionen und Integrität. Die finale Entscheidung fällt daher nicht auf Basis funktionaler Unterschiede, sondern auf Grundlage der Projektintegration und Tool-Unterstützung.

Die Umsetzung erfolgt mit Prisma als ORM, welches eine einheitliche Abstraktion für beide Datenbanksysteme bietet.

## Konsequenzen
- Datenbankoperationen werden über ein ORM (Prisma) abstrahiert
- Die Anwendung bleibt unabhängig von der konkreten Datenbankimplementierung
- Hohe Datenkonsistenz bei gleichzeitigen Geboten wird gewährleistet
- Die Wahl der konkreten Datenbank hat keinen kritischen Einfluss auf die Geschäftslogik