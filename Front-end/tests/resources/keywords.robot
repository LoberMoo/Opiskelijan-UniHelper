*** Settings ***
Library    Browser
Resource   variables.robot
*** Keywords ***
Avaa
    New Browser    ${BROWSER}    headless=${HEADLESS}
    New Page       ${URL_REG}
Fillaa
    [Arguments]    ${user}    ${pass}    ${email}
    Fill Text      id=username    ${user}
    Fill Text      id=password    ${pass}
    Fill Text      id=email       ${email}
Add user
    Click          input.postuser