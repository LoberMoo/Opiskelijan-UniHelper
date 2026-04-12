*** Settings ***
Library     Browser    auto_closing_level=KEEP
Resource    Keywords.robot

*** Test Cases ***
Test Web Form
    New Browser    chromium    headless=No
    New Page       http://localhost:5173/
    Get Title      ==    Vite App
    Type Text      [name="username"]        ${user}    delay=0.1 s
    Type Secret    [name="password"]    $pass      delay=0.1 s
    Click With Options       input.loginform      delay=2 s
    Sleep    3.1s
    Get Title       ==    kotisivu
