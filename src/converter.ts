import hash from 'object-hash';

type gitLabIssue = {
    id: string,
    category: string,
    message: string,
    description: string,
    cve: string,
    severity: string,
    scanner: {
      id: string,
      name: string
    },
    location: {
      file: string,
      start_line: number,
      end_line: number
    },
    identifiers: [
      {
        type: string,
        name: string,
        value: string
      }
    ]
}

type gitLabReport = {
    version: string,
    vulnerabilities: gitLabIssue[],
    remediations: string[],
    scan: {
        analyzer: {
          id: string,
          name: string,
          url: string,
          vendor: {
            name: string
          },
          version: string
        },
        scanner: {
          id: string,
          name: string,
          url: string,
          vendor: {
            name: string
          },
          version: string
        },
        type: string,
        start_time: string,
        end_time: string,
        status: string
    }
}

type sonarIssue = {
    key: string,
    rule: string,
    severity: string,
    component: string,
    project: string,
    line: number,
    hash: string,
    textRange: {
        startLine: number,
        endLine: number,
        startOffset: number,
        endOffset: number
    },
    flows: string[],
    status: string,
    message: string,
    effort: string,
    debt: string,
    author: string,
    tags: string [],
    creationDate: string,
    updateDate: string,
    type:string,
    scope: string,
    quickFixAvailable: boolean
}

const convert = (issues: sonarIssue[], version: string) => {
    let glIssues = issues.map((issue: sonarIssue) => {
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
        }
    });
    let glReport: gitLabReport = {
        version: '15.0.2',
        vulnerabilities: glIssues as gitLabIssue[],
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
    }
    // console.log(glReport);
    return glReport;
}

export { gitLabIssue, sonarIssue, gitLabReport, convert };