import { useState } from "react";
import TemplatePicker from "./components/TemplatePicker";
import Template1 from "./components/Template1";
import Template2 from "./components/Template2";
import Template3 from "./components/Template3";
import Template4 from "./components/Template4";
import Template5 from "./components/Template5";

export default function App() {
  const [selected, setSelected] = useState(null);

  if (selected === 1) return <Template1 onBack={() => setSelected(null)} />;
  if (selected === 2) return <Template2 onBack={() => setSelected(null)} />;
  if (selected === 3) return <Template3 onBack={() => setSelected(null)} />;
  if (selected === 4) return <Template4 onBack={() => setSelected(null)} />;
  if (selected === 5) return <Template5 onBack={() => setSelected(null)} />;
  return <TemplatePicker onSelect={setSelected} />;
}
