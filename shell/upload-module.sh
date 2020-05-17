#!/bin/sh

S3_BUCKET=$1
BUILD_PATH="./build/production"
NO_CACHE_FILES=(\
  "index.html" \
  "index.js" \
  "clear.html"\
  "clear.js" \
  "sw.js" \
  "manifest.json"\
)

for file_name in ${NO_CACHE_FILES[@]}; do
  aws s3 cp --cache-control "no-cache,no-store" "${BUILD_PATH}/${file_name}" "s3://${S3_BUCKET}/${file_name}"
done
aws s3 sync --delete --exact-timestamps "${BUILD_PATH}" "s3://${S3_BUCKET}"
