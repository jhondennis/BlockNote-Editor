import { BlockNote } from "../components/BlockNote";

function BlockNotePage() {
  return (
    <section style={{ display: "flex", justifyContent: "center", paddingTop: 50 }}>
      <div style={{ display: "flex", width: "100%", justifyContent: "center", gap: 10 }}>
        <BlockNote />
      </div>
    </section>
  );
}

export default BlockNotePage;
