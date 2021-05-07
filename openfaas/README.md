# Openfaas

```bash
# Install openfaas
curl -sLSf https://cli.openfaas.com | sudo sh

# Set image prefix
export OPENFAAS_PREFIX="danielhabenicht"

# Setup OpenFaas on cluster
curl -SLsf https://dl.get-arkade.dev/ | sudo sh
arkade install openfaas

# Get and persist password
PASSWORD=$(kubectl get secret -n openfaas basic-auth -o jsonpath="{.data.basic-auth-password}" | base64 --decode; echo)
echo -n $PASSWORD | faas-cli login --username admin --password-stdin
echo $PASSWORD

# Install example functions
faas-cli deploy -f https://raw.githubusercontent.com/openfaas/faas/master/stack.yml
faas-cli list

# Show Grafana Dashboard
kubectl -n openfaas run --image=stefanprodan/faas-grafana:4.6.3 3000 --port=3000 grafana
kubectl -n openfaas expose pod grafana --type=NodePort --name=grafana
GRAFANA_PORT=$(kubectl -n openfaas get svc grafana -o jsonpath="{.spec.ports[0].nodePort}")
echo $GRAFANA_PORT
# Go to http://localhost:$GRAFANA_PORT

# Pull Templates
faas-cli template pull

# Create Helloworld
faas-cli new --lang python3 hello-openfaas --prefix="danielhabenicht"
faas-cli up -f hello-openfaas.yml
faas-cli invoke hello-openfaas

# Create Astronaut Sample
faas-cli new --lang python3 astronaut-finder
faas-cli build -f ./astronaut-finder.yml
faas-cli push -f ./astronaut-finder.yml
faas-cli deploy -f ./astronaut-finder.yml

# Show Logs
kubectl logs deployment/astronaut-finder -n openfaas-fn

# Try out query parameters
faas-cli deploy --name env --fprocess="env" --image="functions/alpine:latest"
echo "" | faas-cli invoke env --query workshop=1
curl -X GET $OPENFAAS_URL/function/env/some/path -d ""
curl $OPENFAAS_URL/function/env --header "X-Output-Mode: json" -d ""

# Chain actions
echo -n "" | faas-cli invoke nodeinfo | faas-cli invoke markdown


faas-cli store deploy SentimentAnalysis
echo -n "California is great, it's always sunny there." | faas-cli invoke sentimentanalysis
```
