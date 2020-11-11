# Hydra

The repo contains the following sub-packages:

* Hydra [CLI tool](substrate-query-framework/cli/)
* Hydra [Indexer](https://github.com/dzhelezov/hydra/tree/28c6d9e18dcc87b791a312fc098b07a2498946b7/substrate-query-framework/index-builder/README.md)
* Event [mappings](https://github.com/dzhelezov/hydra/tree/28c6d9e18dcc87b791a312fc098b07a2498946b7/joystream-query-node/README.md) for the Joystream chain
* Hydra [docs](docs/)

## Bird-eye overview

Hydra has two principal components: Hydra Indexer and Hydra Processor. Hydra Indexer ingests raw data from a substrate chain. Hydra Processor is responsible for transforming the raw data into domain-level entities as defined in `schema.graphl` and the event handlers, both provided by the user. `hydra-cli` provides additional scaffolding and codegen tooling for running and developing a Hydra Processor tailored for the provided schema file.

![Hydra Indexer \(top\) and Hydra Processor \(bottom\) data flows](.gitbook/assets/hydra-diagram.png)

