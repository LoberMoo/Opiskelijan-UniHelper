*** Settings ***
Documentation       Salainen kirjautuminen terveys websovellukseen
Library     Browser    auto_closing_level=KEEP
Variables    env_loader.py

*** Test Cases ***
Testaa Kirjatumista sivustolle
    New Browser    chromium    headless=No
    New Page       https://kivi-server.swedencentral.cloudapp.azure.com/
    Get Title      ==    Vite App
    Type Text      [name="username"]        ${USER}    delay=0.01 s
    Type Secret    [name="password"]        $PASSWORD      delay=0.01 s
    Click With Options       [name="submit"]     delay=0.5 s
    Sleep    3.1s
    Get Title       ==    UniHelper
    Close Browser

