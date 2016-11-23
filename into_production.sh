#!/bin/bash
#
# ./into_production.sh
# Realase operations to create a git branch ready for production with a compressed js file
# Close-compile js files, ask for a tag number, create a tag and a branch
# rm all unused js files, commit and push, return to the default repo
#

echo "######################### START into_production.sh ##############################"
repo = "dd_django"

git checkout $repo
 
echo "Lancement de close-compiler! "

java -jar ~/host/PRODUCTION/Sauvegardes/closure-compiler/closure-compiler-v20161024.jar --compilation_level SIMPLE_OPTIMIZATIONS --js_output_file=feed.compiled.js feed.js feed.util.js feed.data.js feed.request_django.js feed.model.js feed.util_b.js feed.shell.js feed.sidebar.js feed.map_ol2.js

echo "Fin de close-compiler! "

#git add feed.compiled.js

#git commit -m "close-compiler commit"

#git push origin dd_django

echo "#### Tags list :"
git tag 

read -p "???? Tag number to commit: " num

echo "#### Creation de la branche"
git checkout -b stable$num

echo "#### Effacement de tous les fichiers "
git rm src/js/*

echo "#### Desindexation du fichier issu de la compilation"
git reset HEAD -- src/js/feed.compiled.js

echo "#### Commit : Cleaning of folders "
git commit -m "Cleaning of folders"

echo "#### Annule les modifications pour le fichier compile"
git checkout -- src/js/feed.compiled.js

echo "#### Tag the version"
git tag $num -m "production version tag"

echo "#### Publication sur Github"
git push origin stable$num

echo "#### branchs list :"
git branch

read -p "???? Name of the old branch to delete because unused (Enter if nothing to delete): " old

if [ -z "$old" ]
then
    git branch -d stable$old

echo "#### All is good, return to dd_django repo"
git checkout $repo

echo "######################### END into_production.sh ##############################"
