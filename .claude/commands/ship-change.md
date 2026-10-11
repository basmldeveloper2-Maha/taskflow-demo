Implement the following change safely, using the three-agent pipeline.

TASK: $ARGUMENTS

## MANDATORY EXECUTION RULE

You MUST use the Agent tool to invoke these project subagents in this exact order:

1. retriever
2. reasoner
3. verifier

Do not perform Retriever, Reasoner, or Verifier work in the main conversation. Do not use Read, Grep, Glob, Edit, Write, or Bash in the main conversation as a substitute for invoking these agents. If any named agent is unavailable, stop and output: PIPELINE BLOCKED: required subagent unavailable.

Before continuing to each phase, print:

```text
PHASE 1 — RETRIEVER: invoked
PHASE 2 — REASONER: invoked
PHASE 3 — VERIFIER: invoked
PHASE 4 — GATE: evaluated
```

## PHASE 1 — RETRIEVE

Use the Agent tool to invoke the retriever agent with this exact prompt:

```text
You are the Retriever. Research this task for the taskflow-api codebase.
Follow your agent instructions exactly.
TASK: $ARGUMENTS
```

Capture the Retriever's complete output as RETRIEVER_OUTPUT. Do not summarise or truncate it.

## PHASE 2 — REASON

Use the Agent tool to invoke the reasoner agent with this exact prompt:

```text
You are the Reasoner. Propose a complete implementation as a unified diff.
Follow your agent instructions exactly.
TASK: $ARGUMENTS

RETRIEVER OUTPUT:
<paste the full RETRIEVER_OUTPUT here>
```

Capture the Reasoner's complete output as REASONER_OUTPUT. Extract the DIFF section and the RISKS section for Phase 3.

## PHASE 3 — VERIFY

Use the Agent tool to invoke the verifier agent with this exact prompt:

```text
You are the Verifier. Apply the diff temporarily, run checks, report the gate status.
Follow your agent instructions exactly.
TASK: $ARGUMENTS

DIFF:
<paste the DIFF section from REASONER_OUTPUT here>

RISKS:
<paste the RISKS section from REASONER_OUTPUT here>
```

Capture the Verifier's complete output as VERIFIER_OUTPUT.

## PHASE 4 — GATE

Write the VERIFIER_OUTPUT to a temp file:

- PowerShell: `Set-Content -Path .claude/verifier-result.txt -Value $VERIFIER_OUTPUT`
- Bash: `echo "$VERIFIER_OUTPUT" > .claude/verifier-result.txt`

Check the gate token:

- PowerShell: `Select-String -Path .claude/verifier-result.txt -Pattern '^GATE: PASS$' -Quiet`
- Bash: `grep -q "^GATE: PASS$" .claude/verifier-result.txt`

If the check succeeds — GATE: PASS:

1. Apply the diff permanently:
   - Write the diff to `.claude/reasoner.diff`
   - Run: `git apply .claude/reasoner.diff`
2. Stage the changed files:
   - Run: `git add -p` (or `git add <specific files from the diff>`)
3. Commit with a descriptive message that includes the task description:
   - Run:
     ```bash
     git commit -m "feat: $ARGUMENTS

     Implemented via ship-change pipeline. Verifier: PASS"
     ```
4. Report success:
   - Output: "PIPELINE COMPLETE: change committed successfully."
   - Show the `git log --oneline -1` output.

If the check fails — GATE: FAIL:

1. Do NOT apply the diff.
2. Do NOT create any commit.
3. Output: "PIPELINE BLOCKED: Verifier reported failures."
4. Print the full VERIFIER_OUTPUT so the developer can see what failed.
5. Output: "No pipeline-generated changes were applied or committed. Fix the issues above and re-run /ship-change."

Clean up temp files:

- PowerShell: `Remove-Item .claude/verifier-result.txt,.claude/reasoner.diff -ErrorAction SilentlyContinue`
- Bash: `rm -f .claude/verifier-result.txt .claude/reasoner.diff`
