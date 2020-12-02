# Installation of ubuntu dependencies
sudo apt-get update
sudo apt-get install -y python3-pip
# Installation of python dependencies
python3 -m pip install boto3 paramiko
# Installation of experimental grade flintrock
python3 -m pip install git+https://github.com/nchammas/flintrock

[ ! -d "$HOME/.aws" ] && echo "AWS Config Doesnt exist, Creating directory" \
&&

if [ ! -d "$HOME/.aws/credentials" ]
then
    echo "AWS Config Doesnt exist, Creating directory"
    read -p "Enter your access key ID" ACCESS_KEY_ID
    read -p "Enter your secret access key" ACCESS_KEY_SECRET
    read -p "Enter your access token (With the 2 equal signs)" ACCESS_TOKEN
    printf '%s\n' '[default]' "aws_access_key_id=$ACCESS_KEY_ID" "aws_secret_access_key=$ACCESS_KEY_SECRET" "aws_session_token=$ACCESS_TOKEN" > "$HOME"/.aws/credentials

else
    echo "AWS Config Exists, Pushing thru at the speed of light"
fi
echo "Done Installation of dependencies, proceeding with production / analytics bringup"

