#!/bin/bash

if [[ "$TRAVIS_BRANCH" != "master" && "$TRAVIS_BRANCH" != "staging" ]]; then
  echo "We're not on the master or staging branch."
  exit -1
fi
exit 0