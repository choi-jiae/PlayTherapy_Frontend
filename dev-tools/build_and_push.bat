@echo off
SETLOCAL EnableDelayedExpansion

:: Get the directory of the script
FOR %%I IN ("%~dp0..") DO SET "SCRIPT_DIR=%%~fI"

:: Extract the version from package.json
FOR /F "tokens=2 delims=:" %%A IN ('findstr /R /C:"\"version\"" "%SCRIPT_DIR%\package.json"') DO (
    SET "VERSION=%%A"
    SET "VERSION=!VERSION:~2,-2!"
)

:: Check if version is empty
IF "!VERSION!"=="" (
    echo can't extract version
    exit /b 1
)

echo version name : !VERSION!

:: Build the docker image
docker build --platform linux/amd64 -t docker address "%SCRIPT_DIR%\."

:: Check if the build was successful
IF NOT !ERRORLEVEL! EQU 0 (
    echo docker image build failed
    exit /b 1
)

:: Push the docker image
docker push docker address

:: Check if the push was successful
IF NOT !ERRORLEVEL! EQU 0 (
    echo docker image push failed
    exit /b 1
)

ENDLOCAL