#!/bin/sh

# Script to build release zip file that just comtains the
# docker-compose.yml (and supporting files) for a given
# github tag
#
# Its recommended that you use a version of this script
# that matches (or is close to matching) the tag/branch
# that you want to package

if [ -z "$1" ]
   then
     echo "$0: REQUIRED: Tag or branch you wish to package"
     exit 1
fi
TMPDIR=`mktemp -d`
echo "$0: switching to $TMPDIR - script results can be found there"
cd $TMPDIR
git clone -b $1 https://github.com/samtecspg/articulate.git
BUILD="articulate-$1"
mkdir $BUILD
cp articulate/docker-compose.yml $BUILD
cp -r articulate/local-storage $BUILD
rm $BUILD/local-storage/*/.gitignore
zip -9 -y -r $BUILD.zip $BUILD
echo "$0: Complete: go to $TMPDIR for results"