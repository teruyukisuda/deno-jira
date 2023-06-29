import "https://deno.land/std@0.192.0/dotenv/load.ts"
import JiraApi from "npm:jira-client@8.2.2"
import {IssueObject} from "npm:jira-client@8.2.2"

const jira = new JiraApi({
  protocol: 'https',
  host: Deno.env.get('JIRA_HOST'),
  username: Deno.env.get("JIRA_USER"),
  password: Deno.env.get("JIRA_PASS"),
  apiVersion: '2',
  strictSSL: true,
})

jira
  .findIssue('EX-8866')
  .then((issue: IssueObject) => {
    issue.fields.subtasks.forEach((v: IssueObject) => {
      console.log(v)
    })
  })
  .catch((err: any) => {
    console.error(err)
  })
