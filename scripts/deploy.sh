#!/bin/bash
set -o verbose


if [[ "$TRAVIS_BRANCH" != "master" && "$TRAVIS_BRANCH" != "staging" ]]; then
  echo "We're not on the master or staging branch."
  exit -1
fi

openssl aes-256-cbc -K $encrypted_2861304911d5_key -iv $encrypted_2861304911d5_iv -in travis_deploy_key.enc -out ~/travis_deploy_key -d
eval "$(ssh-agent -s)"
chmod 600 ~/travis_deploy_key
echo -e "Host ipsaone.space\n\tStrictHostKeyChecking no\n" >> ~/.ssh/config
ssh-add ~/travis_deploy_key
ssh -i ~/travis_deploy_key travis@ipsaone.space pwd
ssh -i ~/travis_deploy_key travis@ipsaone.space echo $TRAVIS_BRANCH

zip -r ./dist.zip ./dist
scp -i ~/travis_deploy_key ./dist.zip travis@ipsaone.space:~/dist-$TRAVIS_BRANCH-deploying.zip
ssh -i ~/travis_deploy_key travis@ipsaone.space -- unzip -o ~/dist-$TRAVIS_BRANCH-deploying.zip -d ~/ANNA-Frontend-$TRAVIS_BRANCH-new
ssh -i ~/travis_deploy_key travis@ipsaone.space -- mv ~/ANNA-Frontend-$TRAVIS_BRANCH ~/ANNA-Frontend-$TRAVIS_BRANCH-old
ssh -i ~/travis_deploy_key travis@ipsaone.space -- mv ~/ANNA-Frontend-$TRAVIS_BRANCH-new/dist ~/ANNA-Frontend-$TRAVIS_BRANCH
ssh -i ~/travis_deploy_key travis@ipsaone.space -- rm -rf ~/dist-$TRAVIS_BRANCH-deploying.zip ~/ANNA-Frontend-$TRAVIS_BRANCH-old ~/ANNA-Frontend-$TRAVIS_BRANCH-new
