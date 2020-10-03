set -e
set -x

sudo apt-get install snapd

sudo snap install kubectl --classic

sudo snap install helm --classic

helm repo add xr3ngine https://school.xr3ngine.dev

helm repo update

set +x
