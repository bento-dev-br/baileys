apt-get update
apt-get upgrade
apt-get install -y nodejs libwebp ffmpeg wget
npm run build
node ./build/start.js