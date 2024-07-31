# Datenformate

Kurze Übersicht der Datentypen

## Item

```
{
    id: Datenbank ID
    name: Name des Items
    count: Anzahl des Items
    weight: Gewicht einer einheit
    inventory: ID des inventars
}
```

## Inventar

```
{
    id: Datenbank ID
    name: Name des Inventars
    userId: Besitzer des Inventars <String>
    active: Zeigt activ benutztes Inventar des Besitzers
    items: Liste der Items (via join)
    shared: Wenn ja wird besitzer ignoriert <Bool>
}
```
