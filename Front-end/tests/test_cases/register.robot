*** Settings ***
Library     Browser    auto_closing_level=KEEP
Resource    Keywords.robot

*** Test Cases ***
Test Web Form
    New Browser    chromium    headless=No
    New Page       http://localhost:5173/
    Get Title      ==    Vite App
    Click With Options      a       delay=0.5 s
    Type Text      [name="username"]        ${user}    delay=0.1 s
    Type Secret    [name="password"]    $pass      delay=0.1 s
    Type Text      [name="email"]       ${email}
    Click With Options      input.postuser      delay=1 s
    Click With Options      a       delay=1 s
    Close Browser
