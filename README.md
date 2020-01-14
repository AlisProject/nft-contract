# ALIS NFT Contract

## Requirements
- node(12.10.0)
- npm
- envrc

## Environments
```bash
$ cp .envrc.sample .envrc
$ vi .envrc
$ direnv allow
```

## Dependencies
```bash
$ npm install
```

## Test
```bash
$ npx truffle test
```

## Deploy
```bash
$ npx truffle deploy --network live --reset
```