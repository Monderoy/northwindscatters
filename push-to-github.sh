#!/bin/bash

echo "🚀 Pushar NorthWind Scatters till GitHub..."
echo ""
echo "Du kommer behöva:"
echo "1. GitHub användarnamn: Monderoy"
echo "2. Personal Access Token (inte ditt vanliga lösenord)"
echo ""
echo "Har du ingen token? Skapa en här:"
echo "https://github.com/settings/tokens/new"
echo "   - Välj 'repo' permissions"
echo "   - Kopiera token"
echo ""
read -p "Tryck ENTER när du är redo..."

git remote add origin https://github.com/Monderoy/northwindscatters.git
git push -u origin main

echo ""
echo "✅ Klart! Om det funka, kolla:"
echo "https://github.com/Monderoy/northwindscatters"
