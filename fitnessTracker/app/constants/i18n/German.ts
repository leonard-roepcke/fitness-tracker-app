const privacyPolicy= 
`  Datenschutzerklärung

Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO):

Name: [Dein Name / Projektname]
E-Mail: privacy@example.com

Diese E-Mail-Adresse ist eine Musteradresse und muss durch eine gültige Kontaktadresse ersetzt werden.

Allgemeines
Der Schutz Ihrer personenbezogenen Daten ist uns wichtig. Diese App verarbeitet personenbezogene Daten ausschließlich im Rahmen der geltenden Datenschutzgesetze, insbesondere der DSGVO. Die Nutzung der App ist grundsätzlich möglich, ohne personenbezogene Daten an externe Server zu übermitteln.

Verarbeitete Daten
Die App dient der Dokumentation von Fitness- und Trainingsaktivitäten. Dabei können folgende Daten verarbeitet werden:

Körpergewicht

Kalorienangaben

Workout- und Trainingsdaten

Es werden keine Namen, E-Mail-Adressen, Standortdaten, Tracking- oder Analysedaten verarbeitet.

Speicherung der Daten
Alle Daten werden ausschließlich lokal auf dem Endgerät des Nutzers mittels AsyncStorage gespeichert. Es findet keine Speicherung auf Servern oder in der Cloud statt.

Nutzung von Expo
Die App nutzt Expo. Expo kann technisch notwendige, anonymisierte Metadaten verarbeiten, die für den Betrieb der App erforderlich sind. Es erfolgt keine Übermittlung personenbezogener Fitness- oder Körperdaten an Expo.

Rechte der Nutzer
Nutzer haben das Recht auf Auskunft, Berichtigung und Löschung ihrer Daten. Da alle Daten ausschließlich lokal gespeichert werden, können diese jederzeit durch Deinstallation der App gelöscht werden.

Internationale Verfügbarkeit
Die App ist weltweit verfügbar. Die Datenverarbeitung unterliegt dem europäischen Datenschutzrecht (DSGVO).

Stand: [Datum]

`
const termsOfUse = 
`  Nutzungsbedingungen

Diese Nutzungsbedingungen regeln die Nutzung der Fitness-App [App-Name].

Nutzung der App
Die App dient ausschließlich der persönlichen Dokumentation von Fitness- und Trainingsaktivitäten. Es besteht kein Anspruch auf Richtigkeit, Vollständigkeit oder Aktualität der bereitgestellten Inhalte.

Haftungsausschluss
Die Nutzung der App erfolgt auf eigene Verantwortung. Die App ersetzt keine medizinische, therapeutische oder sonstige fachliche Beratung.

Verfügbarkeit
Es wird keine Gewähr für eine dauerhafte, unterbrechungsfreie oder fehlerfreie Verfügbarkeit der App übernommen.

Änderungen
Die Nutzungsbedingungen können jederzeit angepasst werden.

Stand: [Datum]
`
export const German = {
  workouts: "Workouts",
  health: "Gesundheit",
  settings: "Einstellung",
  darkmode: "Dunkelmodus",
  darkmodeSub: "Dunkelmodus aktivieren",
  privacyPolicy: privacyPolicy,
  termsOfUse: termsOfUse,
  privacyPolicyHeading: "Datenschutz",
  termsOfUseHeading:"Nutzungsbedingungen",
  createWorkout: "erstell ein Workout",
  lang:"Deutsch",
  langSub: "Anzeige Sprache wählen",
  weightTracker: "Körpergewicht Tracker",
  calorieTracker: "Kalorien Tracker",
  dailyStreak:"Tägliche Streak",
  weightTrackerSub: "In Gesundheit zeigen",
  calorieTrackerSub: "In Gesundheit zeigen",
  dailyStreakSub:"0:Wöchentliche 1:Tägliche Streak",
}
