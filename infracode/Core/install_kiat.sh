# sudo chmod a+x install_kiat.sh (makes it an executable)

sudo apt install software-properties-common
sudo add-apt-repository ppa:deadsnakes/ppa -y
sudo apt-get update
sudo apt install python3.7 -y
sudo apt install python3-pip -y
sudo pip3 install --upgrade pip
python3 -m pip install boto3
sudo update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.7 2
# Installation of python dependencies
python3 -m pip install --upgrade setuptools
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
python3 get-pip.py --force-reinstall
python3 -m pip install boto3 paramiko


# Installation of experimental grade flintrock
python3 -m pip install git+https://github.com/nchammas/flintrock

#[ ! -d "$HOME/.aws" ] && echo "AWS Config Doesnt exist, Creating directory" \

[ ! -d "$HOME/.aws" ] && echo "AWS Config Doesnt exist, Creating directory" \
&&

if [ ! -d "$HOME/.aws/credentials" ]
then
    echo "AWS Config Doesnt exist, Creating directory"
    read -p "Enter your access key ID: " ACCESS_KEY_ID
    read -p "Enter your secret access key: " ACCESS_KEY_SECRET
    read -p "Enter your access token (With the 2 equal signs): " ACCESS_TOKEN
    read -p "Enter your region (defaults to us-east-1): " DEFAULT_REGION
    DEFAULT_REGION="${DEFAULT_REGION:-us-east-1}"

    mkdir "$HOME"/.aws/
    printf '%s\n' '[default]' "region=$DEFAULT_REGION" "output=json" > "$HOME"/.aws/config
    printf '%s\n' '[default]' "aws_access_key_id=$ACCESS_KEY_ID" "aws_secret_access_key=$ACCESS_KEY_SECRET" "aws_session_token=$ACCESS_TOKEN" > "$HOME"/.aws/credentials

else
    echo "AWS Config Exists, Pushing thru at the speed of light"
fi
echo "Done Installation of dependencies, our GP5 Scripts should now be runnable :)"

echo "Retrieving the script from Dropbox"
wget -O res.tar.gz https://www.dropbox.com/s/qna3xewb96rv8g5/script.tar.gz?dl=0
tar -xzvf res.tar.gz
cd Core
