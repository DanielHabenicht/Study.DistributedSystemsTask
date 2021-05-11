# Openwhisk

## Setup

1. Have a running Kubernetes Cluster
2. Install CLI

   - Download from https://github.com/apache/openwhisk-cli/releases

3. [Install on cluster](https://github.com/apache/openwhisk-deploy-kube/blob/master/README.md)

'''bash
kubectl label nodes --all openwhisk-role=invoker

helm repo add openwhisk https://openwhisk.apache.org/charts
helm repo update
helm install owdev openwhisk/openwhisk -n openwhisk --create-namespace -f openwhisk.yaml

wsk property set --apihost 'localhost:31001'

# Yes! That is a default token use as shown here

wsk property set --auth 23bc46b1-71f6-4ed5-8c54-816aa4f8c502:123zO3xZCLrMN6v2BKK1dXYFpXlPkccOFqm12CdAsMgRU4VrNZ9lyGVCGuMDGIwP

# -i takes care of the invalid cert

wsk action get /whisk.system/samples/greeting --save -i
wsk action invoke /whisk.system/samples/greeting --result -i

# Try out more: https://github.com/apache/openwhisk/blob/master/docs/actions.md

# Use our own

wsk action create example example.js -i
wsk action invoke example --result -i

cd crawler
npm install
zip -rq crawler.zip \*

# Maybe delete before

wsk action delete crawler -i
wsk action create crawler --kind nodejs:14 crawler.zip -i
wsk action invoke crawler -r --param domain danielhabenicht.github.io -i
wsk action invoke crawler --result --param domain t-systems-mms.github.io -i

# Triggers

# This is an action that crawls the website for broken links and show them

wsk trigger create interval \
 --feed /whisk.system/alarms/interval \
 --param minutes 5 \
 --param trigger_payload "{\"domain\":\"danielhabenicht.github.io\"}" \
 --param stopDate "2022-01-31T23:59:00.000Z" -i

wsk rule create timer interval crawler -i
wsk activation list -i crawler
wsk activation result -i <Activation ID>

# Delete

helm uninstall owdev -n openwhisk
'''

## Assignements

```bash
wsk action create example example.js -i
wsk action invoke example --result -i
```
