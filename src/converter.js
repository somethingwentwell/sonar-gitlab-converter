"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convert = void 0;
const convert = (issues) => {
    return issues.map((issue) => {
        return {
            category: issue.rule,
            message: issue.message,
            cve: '',
            severity: issue.severity,
            confidence: '',
            scanner: {
                id: 'sonarqube',
                name: 'SonarQube'
            },
            location: {
                file: issue.component,
                start_line: issue.line,
                end_line: issue.line
            },
            identifiers: [
                {
                    type: 'SonarQube',
                    name: issue.key,
                    value: issue.key,
                    url: 'http://whyjihu.southeastasia.cloudapp.azure.com:9001/project/issues?id=www_public-example_sonar-qube-integration_AYQw63du1WXrh1AvkyAg&issues=' + issue.key + '&open=' + issue.key + '&pullRequest=0&resolved=false'
                }
            ]
        };
    });
};
exports.convert = convert;
