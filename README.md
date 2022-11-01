# sonar-gitlab-converter

## Description
sonar-gitlab-converter is a tool that convert SonarQube Issues from API to GitLab Vulnerability Report format.


## Installation
```bash
npm i -g sonar-gitlab-converter
```


## Usage
```bash
sonar-gitlab-converter --host=<Host> --token=<Token> --project=<Project ID>
```

Output:
- A json file named gl-sast-report.json in GitLab Vulnerability Report format

Arguements:

| Key | Value |
| ------ | ------ |
| host | The web services composing the web API are documented within SonarQube, through the URL /web_api. You can also access the web API documentation from the top bar in SonarQube |
| token | You can create a token in <host>/account/security |
| project | SonarQube Project Key |

More details: https://docs.sonarqube.org/latest/extend/web-api/