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
  suport: "Hilfe & Support",
  privacyPolicyHeadingSub: "unserer Datenschutz",
  termsOfUseHeadingSub:"unsere Nutzungsbedingungen",
  suportSub: "lass uns helfen",
  createWorkout: "erstell ein Workout",
  lang:"Deutsch",
  langSub: "Anzeige Sprache wählen",
  weightTracker: "Körpergewicht Tracker",
  calorieTracker: "Kalorien Tracker",
  dailyStreak:"Streak-Anzeige",
  weightTrackerSub: "In Gesundheit zeigen",
  calorieTrackerSub: "In Gesundheit zeigen",
  dailyStreakModal: "Streak-Modus wählen",
  dailyStreakDaily: "Täglich",
  dailyStreakWeekly: "Wöchentlich",
  dailyStreakSubDaily: "Zählt aufeinanderfolgende Trainingstage",
  dailyStreakSubWeekly: "Zählt aufeinanderfolgende Trainingswochen",
  colorPalette: "Kontrastfarbe",
  colorPaletteSub: "Farbverlauf der App wählen",
  sets: "Sätze",
  set: "Satz",
  addExercise: "Übung hinzufügen",
  restTimer: "Pausentimer",
  restTimerSub: "Pause zwischen Sätzen während des Workouts",
  restTimerDuration: "Pausendauer",
  restTimerOff: "Aus",
  restTimerEnable: "Pausentimer aktivieren",
  restTimerDurationModal: "Pausendauer wählen",
  restTimerSeconds: "Sekunden",
  restTimerMinutes: "Min",
  skipTimer: "Überspringen",
  trackWeight: "Gewicht",
  trackReps: "Wdh.",
  nextSet: "Nächster Satz",
  viewSection:"Darstellung",
  trackerSection:"Tracker",
  suportSection:"Rechtliches & Support",
  newWorkout:"neues Workout",
  workoutendHeading:" Workout Ende",
  workoutEndVolume: "Gesamtvolumen",
  workoutEndExercises: "Übungen",
  workoutVolumeHistory: "Volumen-Verlauf",
  workoutVolumeEmpty: "Noch keine gespeicherten Workouts",
  workoutNotFound: "Workout nicht gefunden",
  safe:"Speichern",
  remove:"Löschen",
  lastTime: "Letztes Mal",
  workoutAbortTitle: "Training abbrechen?",
  workoutAbortMessage: "Dein Fortschritt in dieser Session geht verloren.",
  workoutAbortConfirm: "Abbrechen",
  workoutAbortCancel: "Weiter trainieren",
  workoutNotesPlaceholder: "Notizen: Schreibe hier...",
  historyHeading: "Verlauf",
  historyEmpty: "Noch keine abgeschlossenen Workouts.\nStarte dein erstes Training!",
  historyMinutes: "Min",
  sessionDetailHeading: "Session",
  sessionNotFound: "Session nicht gefunden",
  sessionDelete: "Session löschen",
  sessionDeleteTitle: "Session löschen?",
  sessionDeleteMessage: "Diese Trainingseinheit wird dauerhaft entfernt.",
  exerciseHistoryHeading: "Übungshistorie",
  exerciseHistoryEmpty: "Noch keine Einträge für diese Übung.",
  exerciseBestWeight: "Bestes Gewicht",
  exerciseBestReps: "Beste Wdh.",
  onboardingHeading: "Willkommen",
  onboardingWelcome: "Willkommen bei fitnessTracker",
  onboardingWelcomeBody: "Tracke deine Workouts, sieh deinen Fortschritt und bleib am Ball.",
  onboardingCreate: "Workouts erstellen",
  onboardingCreateBody: "Lege eigene Workouts an oder starte mit einer Vorlage.",
  onboardingTrack: "Fortschritt messen",
  onboardingTrackBody: "Jede Session wird gespeichert — inklusive Übungshistorie und PRs.",
  onboardingNext: "Weiter",
  onboardingSkip: "Überspringen",
  onboardingStart: "Los geht's",
  onboardingReplay: "Onboarding erneut anzeigen",
  onboardingReplaySub: "Einführung nochmal sehen",
  homeEmptyTitle: "Erstelle dein erstes Workout",
  homeEmptyBody: "Noch keine Workouts vorhanden. Leg los oder wähle eine Vorlage.",
  homeOrTemplate: "Oder wähle eine Vorlage:",
  homeFavorites: "Favoriten",
  homeAllWorkouts: "Alle Workouts",
  homeLastTrained: "Zuletzt",
  homeMotivation1: "Willkommen zurück.",
  homeMotivation2: "Bleib dran — jede Session zählt.",
  homeMotivation3: "Bereit für dein nächstes Training?",
  prBadge: "PR!",
  prCountLabel: "neue PRs",
}
