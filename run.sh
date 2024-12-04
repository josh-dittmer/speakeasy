cd models
npm install
npm run build
cd ..

rm -r backend/models/
cp -r models/ backend/models/

rm -r frontend/models/
cp -r models/ frontend/models/