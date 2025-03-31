import { Accessor, createMemo, createSignal, For } from "solid-js";

function App() {
  const volumeUnits: Record<
    string,
    {
      name: string;
      //With respect to liters
      conversion: number;
    }
  > = {
    L: {
      name: "L",
      conversion: 1,
    },
    ML: {
      name: "mL",
      conversion: 0.001,
    },
    GAL: {
      name: "Gal",
      conversion: 3.78541,
    },
    QT: {
      name: "QT",
      conversion: 0.946353,
    },
    PT: {
      name: "PT",
      conversion: 0.473176,
    },
    TBSP: {
      name: "TBSP",
      conversion: 0.0147868,
    },
    TSP: {
      name: "TSP",
      conversion: 0.00492892,
    },
    CUP: {
      name: "CUP",
      conversion: 0.236588,
    },
  };

  const weightUnits: Record<
    string,
    {
      name: string;
      conversion: number;
    }
  > = {
    KG: {
      name: "KG",
      conversion: 1,
    },
    G: {
      name: "G",
      conversion: 0.001,
    },
    LB: {
      name: "LB",
      conversion: 0.45359290943563974,
    },
    OZ: {
      name: "OZ",
      conversion: 0.0283494925,
    },
  };
  const lengthUnits: Record<string, { name: string; conversion: number }> = {
    M: {
      name: "M",
      conversion: 1,
    },
    CM: {
      name: "CM",
      conversion: 0.01,
    },
    MM: {
      name: "MM",
      conversion: 0.001,
    },
    NM: {
      name: "NM",
      conversion: 1e-9,
    },
    IN: {
      name: "IN",
      conversion: 0.0254,
    },
    FT: {
      name: "FT",
      conversion: 0.3048,
    },
    YD: {
      name: "YD",
      conversion: 0.9144,
    },
    MI: {
      name: "MI",
      conversion: 1609.34,
    },
    KM: {
      name: "KM",
      conversion: 1000,
    },
  };

  const [type, setType] = createSignal<string>("volume");
  const units = createMemo(() => {
    if (type() === "volume") {
      return volumeUnits;
    } else if (type() === "weight") {
      return weightUnits;
    } else if (type() === "length") {
      return lengthUnits;
    } else {
      throw new Error("Invalid unit type");
    }
  });

  const unitsSelectorOptions = createMemo(() => {
    return Object.keys(units()).map((unit) => ({
      name: units()[unit].name,
      value: unit,
    }));
  });

  const [from, setFrom] = createSignal<string>("L");
  const [to, setTo] = createSignal<string>("ML");
  const [value, setValue] = createSignal<number>(0);

  const result = createMemo(() => {
    if (from() === "" || to() === "") {
      return 0;
    }
    return (value() * units()[from()].conversion) / units()[to()].conversion;
  });
  return (
    <>
      <div class="main">
        <h1 id="title">
          <span style={{ color: "teal" }}>BABOOLA</span> Unit Converter
        </h1>
        <div class="container">
          <div class="left">
            <Selector
              value={type}
              onChange={(e) => {
                setFrom("");
                setTo("");
                if (e.value === "volume") {
                  setType("volume");
                  console.log(units());
                  setFrom("L");
                  setTo("ML");
                } else if (e.value === "weight") {
                  setType("weight");
                  setFrom("KG");
                  setTo("G");
                } else if (e.value === "length") {
                  setType("length");
                  setFrom("M");
                  setTo("CM");
                }
              }}
              options={() => [
                { name: "Volume", value: "volume" },
                { name: "Weight", value: "weight" },
                { name: "Length", value: "length" },
              ]}
            />
            <h3>FROM</h3>
            <div id="from" class="lcd"></div>
            <Selector
              value={from}
              onChange={(e) => setFrom(e.value)}
              options={unitsSelectorOptions}
            />
            <h3>RESULT</h3>
            <div
              id="result"
              class="lcd"
              style={{ display: "inline-block", width: "100px" }}
            >
              {result()}
            </div>
            <Selector
              value={to}
              onChange={(e) => setTo(e.value)}
              options={unitsSelectorOptions}
            />
          </div>
          <div class="right">
            <div class="keypad">
              <For
                each={["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0"]}
              >
                {(key) => (
                  <button
                    id={key}
                    onClick={() => {
                      document.querySelector("#from")!.innerHTML += key;

                      setValue(
                        Number(document.querySelector("#from")!.innerHTML)
                      );
                    }}
                  >
                    {key}
                  </button>
                )}
              </For>
              <button
                id="C"
                onClick={() => {
                  setValue(0);
                  (document.querySelector("#from") as HTMLInputElement).value =
                    "";
                }}
              >
                C
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Selector({
  onChange,
  options,
  value,
}: {
  onChange: (e: { value: string }) => void;
  options: Accessor<{ name: string; value: string }[]>;
  value: Accessor<string>;
}) {
  console.log(value);
  return (
    <>
      <div class="selector-container">
        <For each={options()}>
          {(option) => {
            return (
              <button
                class={value() == option.value ? "selected" : ""}
                onClick={() => onChange({ value: option.value })}
              >
                <div
                  class={`indicator ${value() == option.value ? "on" : ""}`}
                ></div>
                {option.name}
              </button>
            );
          }}
        </For>
      </div>
    </>
  );
}
export default App;
