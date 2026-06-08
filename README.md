# fitness-tracker-app
in Progress
Die Fitness App wird bald im Appstore verfuegbar sein.





npx create-expo-app fitnessTracker
sudo npm install --global @expo/ngrok@^4.1.0

cd fitnessTracker/
npm start #geht glaube ich nicht
npm start -- --tunnel

build
eas login
//die daten sind in bitworden unter expos
eas build -p android --profile preview

## Auto Git Push

Nach jeder Cursor-Agent-Session werden Änderungen automatisch nach GitHub gepusht (`.cursor/hooks/auto-git-push.sh`).

