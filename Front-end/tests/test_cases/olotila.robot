*** Settings ***
Documentation       Olotilan antamis testi
Library     Browser    auto_closing_level=KEEP



*** Test Cases ***

Avaa selain
    New Browser    chromium    headless=No
    New Page       https://kivi-server.swedencentral.cloudapp.azure.com/homepage.html

Anna fiilis
    Click With Options      [id=p5]       delay=0.5 s

Sulje ikkuna
    sleep   2s
    Close Browser