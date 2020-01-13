#!/usr/bin/env bash
cd /root/back
npm start &
cd /root/front
ng serve --host 0.0.0.0
