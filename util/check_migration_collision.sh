#!/bin/bash

! ls conf/db/migration/default | grep -Po '^.*__' | sort | uniq -c | grep -Pv '\s+1'
