#!/bin/bash
#
# ./into_production.sh
# Realase operations to create a git branch ready for production with a compressed js file
# Run it only on Entente2
# Close-compile js files, ask for a tag number, create a tag and a branch
# rm all unused js files, commit and push, return to the default repo
#

echo "######################### START into_production.sh ##############################"
repo="dd_django"

git checkout $repo
 
read -p "### Lancement de close-compiler! " tmp

java -jar ./compiler/closure-compiler-v20161201.jar --compilation_level SIMPLE_OPTIMIZATIONS --js_output_file=./src/js/feed.compiled.js ./src/js/feed.js ./src/js/feed.util.js ./src/js/feed.data.js ./src/js/feed.request_django.js ./src/js/feed.model.js ./src/js/feed.util_b.js ./src/js/feed.shell.js ./src/js/feed.sidebar.js ./src/js/feed.map_ol2.js

echo "Fin de close-compiler! "
git add feed.compiled.js

echo "#### Tags list :"
git tag 

read -p "???? Tag number to commit (ex: 1.0.1): " num

read -p "#### Creation de la branche" tmp
git checkout -b stable$num

read -p "#### Effacement de tous les fichiers inutiles" tmp
rm -f src/js/*

read -p "#### Desindexation du fichier issu de la compilation" tmp
git checkout -- src/js/feed.compiled.js

read -p "#### Commit : Cleaning of folders " tmp
git commit -am "Cleaning of folders"

read -p "#### Tag the version" tmp
git tag $num -m "production version tag"

read -p "#### Publication sur Github" tmp
git push origin stable$num

echo "#### branchs list :"
git branch

read -p "#### All is good, return to dd_django repo" tmp
git checkout $repo

echo "######################### END into_production.sh ##############################"
echo "sur entente1 : "
echo "cd www/static/libs/feedback"
echo "git pull"
echo "git checkout stable$num"
