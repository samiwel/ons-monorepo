#!/bin/bash
set -e

yarn install --froze-lockfile

yarn lint -- --max-warnings=0
