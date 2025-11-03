#!/bin/bash
cd /home/kavia/workspace/code-generation/natural-query-processing-platform-96847-96857/dsp_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

