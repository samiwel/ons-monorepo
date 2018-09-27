#!/bin/bash
set -e

if [[ -z $1 ]]; then
    echo "Change path cannot be empty"
    exit 1
fi

# Can't use commit range on PRs as it doesn't work with forced pushes
commits="master...$TRAVIS_BRANCH"
if [[ $TRAVIS_BRANCH = "master" ]]; then
    commits=$TRAVIS_COMMIT_RANGE
fi

echo "git diff --name-only $commits"
git diff --name-only $commits > files_changed
cat files_changed

git diff --name-only $commits | sort -u | uniq | grep $1 > /dev/null