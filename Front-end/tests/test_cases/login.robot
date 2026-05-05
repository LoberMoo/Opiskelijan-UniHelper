*** Settings ***
Library     Browser    auto_closing_level=KEEP
Variables env_loader.py

*** Test Cases ***
Test Web Form
    New Browser    chromium    headless=No
    New Page       https://kivi-server.swedencentral.cloudapp.azure.com/
    Get Title      ==    Vite App
    Type Text      [name="username"]        ${USER}    delay=0.1 s
    Type Secret    [name="password"]    $PASS      delay=0.1 s
    Click With Options       input.loginform      delay=2 s
    Sleep    3.1s
    Get Title       ==    kotisivu
