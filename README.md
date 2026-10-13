# Bokhyllan

## Starta appen

Du behöver Node.js (version 20 eller senare) och internetuppkoppling. Ingen API-nyckel eller registrering krävs.

```bash
cd bokhylla/
npm install
npm run dev
```
Öppna sedan http://localhost:5173 i webbläsaren.

## Så använder du appen

1. **Sök:** skriv en titel eller författare på startsidan och tryck på Sök.
2. **Lägg till:** tryck på "Lägg till i läslistan" på en bok i sökresultatet. Knappen blir "Ta bort från läslistan" när boken finns i listan.
3. **Läslistan:** öppna "Min läslista" i menyn. Där kan du ge varje bok ett betyg (heltal 1-5) och en anteckning, och spara med Spara. Du kan också ta bort enskilda böcker eller rensa hela listan.
4. **Bokinformation:** klicka på en boktitel för att se omslag, beskrivning, förlag, sidantal med mera.

## Övriga kommandon

```bash
npm run build
```