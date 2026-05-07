*** Settings ***
Documentation       Merkinnän lisäämis robotti
Library     Browser    auto_closing_level=KEEP

*** Variables ***
${Olotila}      Hyvä
${Paino}        68.8
${Uni-maara}    8
${Notes}    Kävin lenkillä tänään

*** Test Cases ***

Avaa selain
    New Browser    chromium    headless=No
    New Page       https://kivi-server.swedencentral.cloudapp.azure.com/paivakirja.html

Lisää päiväkirjamerkintä
    Click With Options      [class="add_diary_button"] 
    Type Text   [name="mood"]       ${Olotila}  delay=0.05s
    Type Text   [name="weight"]     ${Paino}    delay=0.05s
    Type Text   [name="sleep"]      ${Uni-maara}    delay=0.05s
    Type Text   [name="notes"]      ${Notes}    delay=0.05s
    Sleep   1s  
    Click With Options      [class="add_entry"]
    Sleep   2s
    Click With Options      [class="close_add_entry"]

Sulje selain
    Sleep   2s
    Close Browser