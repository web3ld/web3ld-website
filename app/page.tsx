// app/page.tsx  (server component — NO "use client")
import Github from "@components/utilities/socials/github";

export default function Page() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* default is 200px wide and green per the component's CSS module */}
      <Github />

      {/* you can override: */}
      {/* <Github size={120} className="some-class" /> */}
      {/* or inline override color: <div style={{ color: 'var(--green)'}}><Github /></div> */}
    </main>
  );
}
