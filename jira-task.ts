import "https://deno.land/std@0.192.0/dotenv/load.ts"
import {Command} from "https://deno.land/x/cliffy@v0.19.2/command/mod.ts";
import {parse} from "https://deno.land/std@0.79.0/encoding/csv.ts";
import {BufReader} from "https://deno.land/std@0.79.0/io/bufio.ts";
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

const {options, args} = await new Command()
  .name("jira-task")
  .version("0.1.0")
  .description("handling jira tasks")
  .command("getSubTasks <issueId:string>")
  .action(async (_, issueId) => await getSubTasks(issueId))
  .command("addSubTasks <issueId:string>")
  .action(async (_, issueId) => await addSubTasks(issueId))
  .parse(Deno.args);

// .command("addSubTasks <issueId:string>")
// .action(async (option, issueId) => await addSubTasks(issueId))
// if (Deno.args.length !== 1) {
//   throw new Error("")
// }

async function getSubTasks(parent: string) {
  jira
    .findIssue(parent)
    .then((issue: IssueObject) => {
      issue.fields.subtasks.forEach((v: IssueObject) => {
        console.log(`${v.key} : ${v.fields.summary} : ${v.fields.status.name}`)
      })
    })
    .catch((err: unknown) => {
      console.error(err)
    })
}

async function addSubTasks(parent: string) {
  const WORKPATH = Deno.env.get("JIRA_WORK_PATH");
  const file = await Deno.open(`${WORKPATH}/subtasks.csv`);
  const buf = BufReader.create(file);
  const result = await parse(buf);
  console.log(result)
}


// if (Object.keys(options).length === 0 || options.query) {
//   jira
//     .findIssue(args[0])
//     .then((issue: IssueObject) => {
//       issue.fields.subtasks.forEach((v: IssueObject) => {
//         console.log(`${v.key} : ${v.fields.summary} : ${v.fields.status.name}`)
//       })
//     })
//     .catch((err: unknown) => {
//       console.error(err)
//     })
// } else {
//   jira
//     .addNewIssue({
//       fields: {
//         project: {id: '10100'},
//         summary: 'test-sub1',
//         description: 'API検証用テスト',
//         issuetype: {name: 'サブタスク'},
//         parent: {key: 'EX-8866'},
//       },
//     })
//     .then((v: any) => {
//       console.log(v)
//     })
//
//   console.log("add task")
// }

// jira
//   .findIssue(args[0])
//   .then((issue: IssueObject) => {
//     console.log(issue)
//   })
//   .catch((err: unknown) => {
//     console.error(err)
//   })


// p2netexインフラ
// jira.getProject('10702').then((v: any) => {
//   console.log(`${JSON.stringify(v, null, ' ')}`)
//   //return JSON.stringify(v, null, ' ')
// })
//
// p2netEX
// jira.getProject('10100').then((v: any) => {
//   console.log(`${JSON.stringify(v, null, ' ')}`)
// })





