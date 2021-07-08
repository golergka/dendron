#!/bin/bash

# Go to top level
pushd "$(git rev-parse --show-toplevel)" || exit 1

mkdir -p packages/plugin-core/validator
# Generate validator for dendron.yml
npx typescript-json-schema packages/common-all/tsconfig.json DendronConfig > packages/plugin-core/validator/dendron-yml.validator.json

popd || exit 1