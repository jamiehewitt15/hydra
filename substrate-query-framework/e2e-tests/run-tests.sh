function cleanup()
{
    yarn post-e2e-test
}

docker build ../cli -t hydra-cli:latest --no-cache
docker build ./schema -t hydra:latest
docker build ../index-server -t indexer-api-server:latest
# setup db's
yarn pre-e2e-test

sleep 10s

# wait for the indexer api to start 
timeout 300 bash -c 'while [[ "$(curl -s -o /dev/null -w ''%{http_code}'' localhost:4001/graphql)" != "200" ]]; do sleep 5; done' || false

# run the actual tests
yarn e2e-test

# clean up
trap cleanup EXIT
