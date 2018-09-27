#!/bin/bash
set -e

yarn install --frozen-lockfile

yarn lint -- --max-warnings=0
