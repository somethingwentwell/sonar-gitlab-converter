"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convert = void 0;
const convert = (issues, version) => {
    let glIssues = issues.map((issue) => {
        if (issue.severity === 'CRITICAL' || issue.severity === 'BLOCKER') {
            issue.severity = 'Critical';
        }
        else if (issue.severity === 'MAJOR') {
            issue.severity = 'High';
        }
        else if (issue.severity === 'MINOR') {
            issue.severity = 'Medium';
        }
        else {
            issue.severity = 'Info';
        }
        return {
            id: issue.key,
            category: 'sast',
            message: issue.message,
            description: issue.message,
            cve: '',
            severity: issue.severity,
            scanner: {
                id: 'sonarqube',
                name: 'SonarQube'
            },
            location: {
                file: issue.component.split(':')[1],
                start_line: issue.textRange ? issue.textRange.startLine : 0,
                end_line: issue.textRange ? issue.textRange.endLine : 0
            },
            identifiers: [
                {
                    type: 'SonarQube',
                    name: `sonarqube:${issue.rule}`,
                    value: `sonarqube:${issue.rule}`
                }
            ]
        };
    });
    let glReport = {
        version: '15.0.2',
        vulnerabilities: glIssues,
        remediations: [],
        scan: {
            analyzer: {
                id: 'sonarqube',
                name: 'SonarQube Code Scan',
                url: 'https://www.sonarqube.org/',
                vendor: {
                    name: 'GitLab'
                },
                version: version
            },
            scanner: {
                id: 'sonarqube',
                name: 'SonarQube Code Scan',
                url: 'https://www.sonarqube.org/',
                vendor: {
                    name: 'GitLab'
                },
                version: version
            },
            type: 'sast',
            start_time: new Date(Date.now()).toISOString().split('.')[0],
            end_time: new Date(Date.now()).toISOString().split('.')[0],
            status: 'success'
        }
    };
    // console.log(glReport);
    return glReport;
};
exports.convert = convert;
