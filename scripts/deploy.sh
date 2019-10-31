#!/bin/bash

if [[ "$TRAVIS_BRANCH" != "master" && "$TRAVIS_BRANCH" != "staging" ]]; then
  echo "We're not on the master or staging branch."
  exit -1
fi

zip -r ./dist.zip ./dist
scp -i ~/travis_deploy_key ./dist.zip travis@ipsaone.space:~/dist-$TRAVIS_BRANCH-deploying.zip
ssh -i ~/travis_deploy_key travis@ipsaone.space -- unzip ~/dist-$TRAVIS_BRANCH-deploying.zip -d ~/ANNA-Frontend-$TRAVIS_BRANCH-new
ssh -i ~/travis_deploy_key travis@ipsaone.space -- mv ~/ANNA-Frontend-$TRAVIS_BRANCH ~/ANNA-Frontend-$TRAVIS_BRANCH-old
ssh -i ~/travis_deploy_key travis@ipsaone.space -- mv ~/ANNA-Frontend-$TRAVIS_BRANCH-new/dist ~/ANNA-Frontend-$TRAVIS_BRANCH
ssh -i ~/travis_deploy_key travis@ipsaone.space -- rm -rf ~/dist-$TRAVIS_BRANCH-deploying.zip ~/ANNA-Frontend-$TRAVIS_BRANCH-old ~/ANNA-Frontend-$TRAVIS_BRANCH-new