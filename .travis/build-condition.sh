#!/bin/bash
set -e

if [[ -z $1 ]]; then
    echo "Change path cannot be empty"
    exit 1
fi

commits="master...$TRAVIS_BRANCH"
if [[ $TRAVIS_BRANCH = "master" ]]; then
    commits=$TRAVIS_COMMIT_RANGE
fi

git diff --name-only $commits | sort -u | uniq | grep $1 > /dev/null