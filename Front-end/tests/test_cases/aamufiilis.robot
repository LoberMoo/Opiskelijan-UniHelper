*** Settings ***
Documentation       Aamufiilis-toiminnon testit
Library             SeleniumLibrary

Suite Setup         Open Browser    https://kivi.server.swedencentral.cloudapp.azure.com/homepage.html    chrome
Suite Teardown      Close Browser

*** Test Cases ***

Aamufiilis-pallot näkyvissä
    Wait Until Element Is Visible    id=p1
    Wait Until Element Is Visible    id=p2
    Wait Until Element Is Visible    id=p3
    Wait Until Element Is Visible    id=p4
    Wait Until Element Is Visible    id=p5
    Sleep    1s

Punainen
    Click Element    id=p1
    Sleep    0.67s
    ${class}=    Get Element Attribute    id=p1    class
    Should Contain    ${class}    valittu

Oranssi
    Click Element    id=p2
    Sleep    0.67s
    ${class}=    Get Element Attribute    id=p2    class
    Should Contain    ${class}    valittu

Keltainen
    Click Element    id=p3
    Sleep    0.67s
    ${class}=    Get Element Attribute    id=p3    class
    Should Contain    ${class}    valittu

Vaaleanvihree
    Click Element    id=p4
    Sleep    0.67s
    ${class}=    Get Element Attribute    id=p4    class
    Should Contain    ${class}    valittu

Vihreä
    Click Element    id=p5
    Sleep    0.67s
    ${class}=    Get Element Attribute    id=p5    class
    Should Contain    ${class}    valittu

Lopullinen valinta
    Click Element    id=p1
    Sleep    1s
    Click Element    id=p5
    Sleep    1s
    ${class_p5}=    Get Element Attribute    id=p5    class
    ${class_p1}=    Get Element Attribute    id=p1    class
    Should Contain      ${class_p5}    valittu
    Should Not Contain  ${class_p1}    valittu
    Sleep    2s