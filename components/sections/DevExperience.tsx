import { highlightLines } from "@/lib/shiki";
import { Kicker, H2, Lede, Section } from "@/components/ui/kit";
import CodeSyncClient from "./CodeSyncClient";

const SNIPPET = `// one command in — real actions out
android_get_screen()
android_open_app(package_name: "org.telegram.messenger")
android_execute_action(action_type: "click", text: "Rahul")
android_execute_action(action_type: "input", text: "I'll be there in 10 minutes.")
android_execute_action(action_type: "click", text: "Send")
android_take_screenshot()`;

export default async function DevExperience() {
  const lines = await highlightLines(SNIPPET, "typescript");

  return (
    <Section id="code" className="border-t border-white/[0.06] bg-void">
      <div className="mb-16 max-w-[900px]">
        <Kicker index="09">Developer experience</Kicker>
        <H2>
          Simple on the outside.
          <br />
          <span className="text-dim">Powerful underneath.</span>
        </H2>
        <Lede className="mt-7">
          Fourteen MCP tools. One protocol. Every call is a real, verified action — scroll and watch the code
          drive the phone.
        </Lede>
      </div>
      <CodeSyncClient lines={lines} />
    </Section>
  );
}
