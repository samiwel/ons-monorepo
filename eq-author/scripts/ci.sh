#!/bin/bash
set -e

yarn install --froze-lockfile

yarn lint
