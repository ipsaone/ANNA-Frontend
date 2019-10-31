#!/bin/sh

if [[ "$TRAVIS_BRANCH" != "master" || "$TRAVIS_BRANCH" != "staging" ]]; then
  echo "We're not on the master or staging branch."
  exit 0
fi